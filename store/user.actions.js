import { Alert } from 'react-native';
import config from '../config';
import { SET_NEW_RECORD, LOGOUT, REFRESH_IMAGE } from './actionConstants';
import {
  signUpOrIn,
  checkStorage,
  refreshTokenForId,
  saveDataToStorage,
  authenticate,
  deleteAccount,
  fetchFirebase,
} from './auth.actions';
import { clearSettings } from './temps.actions';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import User from '../models/User';

export const signupOrLogin = (
  // SIGN UP OR LOGIN IN FIREBASE AUTHENTICATION WITH EMAIL AND PASSWORD
  action,
  email,
  password,
  rememberMe,
  name = null,
  image = null
) => {
  return async (dispatch) => {
    let user = new User();
    try {
      const storage = await dispatch(checkStorage());
      const signUpOrInResponse = await dispatch(
        signUpOrIn(action, email, password)
      );
      if (action === 'signup') {
        user.authId = signUpOrInResponse.localId;
        user.name = name;
        user.email = email;
        user.image = image;
        user = await dispatch(
          saveUserData('create', signUpOrInResponse.idToken, user)
        );
      } else {
        user = await dispatch(
          fetchUserData(signUpOrInResponse.idToken, signUpOrInResponse.localId)
        );
      }
      const expirationDate = new Date(
        new Date().getTime() + parseInt(signUpOrInResponse.expiresIn) * 1000
      );

      if (user.image && user.image.base64) {
        user.image.imageUri = await dispatch(
          saveImageToFileSystem(user.name, user.image)
        );
      }

      dispatch(
        // SAVE USER INFO TO REDUX
        authenticate(
          signUpOrInResponse.localId,
          signUpOrInResponse.idToken,
          signUpOrInResponse.refreshToken,
          expirationDate,
          user.privateId,
          user.publicId,
          user.email,
          user.name,
          user.highestScore,
          user.image ? user.image.imageUri : null,
          storage.darkTheme
        )
      );

      if (rememberMe) {
        // SAVE USER INFO TO DEVICE STORAGE IF REMEMBER-ME OPTION IS ON
        dispatch(
          saveDataToStorage(
            signUpOrInResponse.localId,
            signUpOrInResponse.idToken,
            signUpOrInResponse.refreshToken,
            expirationDate,
            user.privateId,
            user.publicId,
            user.email,
            user.name,
            user.highestScore,
            user.image ? user.image.imageUri : null,
            storage.darkTheme
          )
        );
      }
      dispatch(clearSettings());
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const saveUserData = (action, token, user) => {
  // SAVE USER DETAILS TO REALTIME DATABASE AFTER NEW SIGN UP
  return async (dispatch) => {
    let urlPrivateUser;
    let urlPublicUser;
    let method;
    const header = { 'Content-Type': 'application/json' };
    let privateBody = {
      name: user.name,
      email: user.email,
    };
    let publicBody = {
      name: user.name,
    };
    let response;

    if (action === 'create') {
      urlPrivateUser = config.API_USERS.concat('auth='.concat(token));
      urlPublicUser = config.API_USERS_PUBLIC.concat('auth='.concat(token));
      method = 'POST';
      privateBody.authId = user.authId;
      privateBody.highestScore = 0;
      if (user.image) {
        privateBody.image = user.image.base64;
        publicBody.image = user.image.base64;
      }
      publicBody.authId = user.authId;
      publicBody.highestScore = 0;
    } else if (action === 'update') {
      urlPrivateUser = config.API_USERS_DPI.concat(user.privateId)
        .concat(config.API_USERS_DPA)
        .concat(token);
      urlPublicUser = config.API_USERS_PUBLIC_DPI.concat(user.publicId)
        .concat(config.API_USERS_DPA)
        .concat(token);
      method = 'PATCH';
      if (user.image) {
        privateBody.image = user.image.base64;
        publicBody.image = user.image.base64;
      }
      if (user.highestScore) {
        publicBody.highestScore = user.highestScore;
      }
    } else {
      throw new Error('400: Wrong action');
    }

    try {
      response = await dispatch(
        fetchFirebase(urlPublicUser, method, header, publicBody)
      );
      user.publicId = response.name;

      privateBody.publicId = user.publicId;
      response = await dispatch(
        fetchFirebase(urlPrivateUser, method, header, privateBody)
      );
      user.privateId = response.name;
    } catch (err) {
      if (action === 'create') {
        await dispatch(deleteUserAccount(token));
      }
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
    }
    return user;
  };
};

export const fetchUserData = (token = null, authId = null) => {
  // FETCH USER DETAILS FROM REALTIME DATABASE
  return async (_, getState) => {
    const body = new URLSearchParams();
    body.append('orderBy', '"authId"');
    body.append(
      'equalTo',
      '"'.concat(authId ? authId : getState().user.privateId).concat('"')
    );
    body.append('auth', token ? token : getState().auth.token);
    const endPointUrl = config.API_USERS.concat(body.toString());

    const response = await fetch(endPointUrl);
    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'Permission denied')
        throw new Error(
          "There's something wrong with our servers. Please try again later =(("
        );
    }

    let user = new User();
    user.privateId = Object.keys(data)[0];
    user.publicId = data[Object.keys(data)[0]].publicId;
    user.name = data[Object.keys(data)[0]].name;
    user.email = data[Object.keys(data)[0]].email;
    user.highestScore = data[Object.keys(data)[0]].highestScore;
    user.image = { base64: data[Object.keys(data)[0]].image };

    return user;
  };
};

export const refreshToken = ({ from, authentication }) => {
  // THIS WILL FETCH AND SAVE A NEW TOKEN TO REDUX AND THE STORAGE, WITHOUT FETCHING USER DATA
  return async (dispatch, getState) => {
    const storage = await dispatch(checkStorage());

    let privateId;
    let publicId;
    let email;
    let name;
    let highestScore;
    let userImage;
    let resData;

    switch (from) {
      case 'firebase':
        try {
          resData = await dispatch(refreshTokenForId(storage.refreshToken));
          const userInfo = await dispatch(
            fetchUserData(resData.id_token, resData.user_id)
          );
          privateId = Object.keys(userInfo)[0];
          email = userInfo[Object.keys(userInfo)[0]].email;
          name = userInfo[Object.keys(userInfo)[0]].userName;
          highestScore = userInfo[Object.keys(userInfo)[0]].highestScore;
          userImage = storage.userImage;
        } catch (err) {
          throw new Error('Failed to get user infos');
        }
        break;
      case 'storage':
        resData = await dispatch(refreshTokenForId(storage.refreshToken));
        privateId = storage.privateId;
        publicId = storage.publicId;
        email = storage.email;
        name = storage.userName;
        highestScore = storage.highestScore;
        userImage = storage.userImage;
        break;
      case 'redux':
      default:
        resData = await dispatch(
          refreshTokenForId(getState().auth.refreshToken)
        );
        privateId = getState().user.privateId;
        publicId = getState().user.publicId;
        email = getState().user.email;
        name = getState().user.userName;
        highestScore = getState().user.highestScore;
        userImage = getState().user.userImage;
        break;
    }

    const expirationDate =
      (authentication || storage) &&
      new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000);

    console.log(authentication);

    if (authentication) {
      try {
        dispatch(
          // SAVE NEW TOKEN TO REDUX
          authenticate(
            resData.user_id,
            resData.id_token,
            resData.refresh_token,
            expirationDate,
            privateId,
            publicId,
            email,
            name,
            highestScore,
            userImage,
            storage.darkTheme
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }

    if (storage) {
      // IF UPDATE DATA IN DEVICE STORAGE
      try {
        dispatch(
          saveDataToStorage(
            resData.user_id,
            resData.id_token,
            resData.refresh_token,
            expirationDate,
            privateId,
            publicId,
            email,
            name,
            highestScore,
            userImage,
            storage.darkTheme
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };
};

export const saveImageToFileSystem = (userName, userImage) => {
  // SAVE USER PICTURE TO FILE WHEN LOGIN OR SIGNUP OR UPDATE
  return async () => {
    let path;

    if (!userImage.uri) {
      // IMAGE DOWNLOADED, MUST CONVERT TO FILE
      path = FileSystem.documentDirectory + userName.toString() + '.jpg';
      try {
        await FileSystem.writeAsStringAsync(path, userImage.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      path =
        FileSystem.documentDirectory + userImage.uri.split('/').pop();
      try {
        await FileSystem.moveAsync({
          //saves file from temp folder to filesystem
          from: userImage.uri,
          to: path,
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }
    return path;
  };
};

export const deleteImageFromFileSystem = (file = null) => {
  return async (_, getState) => {
    const path = file ? file : getState().user.userImage;
    if (path) {
      try {
        await FileSystem.deleteAsync(path, {
          idempotent: true,
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };
};

export const checkNewRecord = () => {
  return async (dispatch, getState) => {
    const points = getState().game.points;
    const highestScore = getState().user.highestScore;
    if (points > highestScore) {
      // SAVE RECORD TO RESUX
      Alert.alert('Wow', 'New Record!', [{ text: 'Ok' }]);

      try {
        await dispatch(setNewRecord(points));
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      return false;
    }
  };
};

export const setNewRecord = (newRecord) => {
  return async (dispatch, getState) => {
    // REFRESH TOKEN IF NEEDED
    if (new Date(getState().auth.expirationToken) <= new Date()) {
      await dispatch(refreshToken({ from: 'redux', authentication: true }));
    }

    // SAVE RECORD TO DEVICE STORAGE
    const storage = await dispatch(checkStorage());
    if (storage) {
      try {
        await dispatch(
          saveDataToStorage(
            storage.authId,
            storage.token,
            storage.refreshToken,
            storage.expiryDate,
            storage.privateId,
            storage.publicId,
            storage.email,
            storage.userName,
            newRecord,
            storage.darkTheme
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }

    // SAVE RECORD TO FIREBASE
    const endPointUrl = config.API_USERS_DPI.concat(
      getState().user.privateId.concat(
        config.API_USERS_DPA.concat(getState().auth.token)
      )
    );
    const response = await fetch(endPointUrl, {
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        highestScore: newRecord,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save new Record');
    }
    dispatch({ type: SET_NEW_RECORD, points: newRecord });
  };
};

export const changeUserEmail = (newEmail) => {
  return async (dispatch, getState) => {
    if (newEmail) {
      if (new Date(getState().auth.expirationToken) <= new Date()) {
        await dispatch(refreshToken({ from: 'redux', authentication: true }));
      }

      const endPointUrl = config.API_USERS_UPDT.concat(config.API_KEY);

      const body = JSON.stringify({
        idToken: getState().auth.token,
        email: newEmail,
        returnSecureToken: true,
      });

      const response = await fetch(endPointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(
          'Errors are bad.. and you just found one. Please try again later.'
        );
      }
      const data = await response.json();
      return data;
    }
    return false;
  };
};

export const updateUserData = (callBackFunc) => {
  return async (dispatch, getState) => {
    if (getState().temps.pending) {
      let newEmailRequest = null;
      let newImage = null;
      let newUserEmail;

      // IF EQUAL TO OLD INFO OR NULL, KEEP OLD INFO, ELSE, SET NEW ONE
      if (
        getState().temps.settings.email === getState().user.email ||
        getState().temps.settings.email === null
      ) {
        newUserEmail = getState().user.email;
        newEmailRequest = null;
      } else {
        newUserEmail = getState().temps.settings.email;
        newEmailRequest = getState().temps.settings.email;
      }

      if (newEmailRequest) {
        // SAVE NEW EMAIL (AND CHANGE EMAIL FOR LOGIN)
        try {
          newEmailRequest = await dispatch(changeUserEmail(newUserEmail));
        } catch (err) {
          throw new Error(err.message);
        }
      }

      const newUserImage =
        !!getState().temps.settings.image &&
        (getState().temps.settings.image.uri === getState().user.userImage
          ? null
          : getState().temps.settings.image);

      // IF EQUAL TO OLD INFO OR NULL, KEEP OLD INFO, ELSE, SET NEW ONE
      const newUserName =
        getState().temps.settings.name === getState().user.userName ||
        getState().temps.settings.name === null
          ? getState().user.userName
          : getState().temps.settings.name;

      if (newUserImage) {
        // SAVE NEW IMAGE TO FILE SYSTEM
        try {
          await dispatch(deleteImageFromFileSystem());
          newImage = await dispatch(
            saveImageToFileSystem(newUserName, newUserImage)
          );
          // CLEAR CACHE BEFORE SETTING NEW IMAGE
          dispatch({ type: REFRESH_IMAGE });
        } catch (err) {
          throw new Error(err.message);
        }
      }

      let token = newEmailRequest
        ? newEmailRequest.idToken
        : getState().auth.token;
      let refreshToken = newEmailRequest
        ? newEmailRequest.refreshToken
        : getState().auth.refreshToken;
      let expires_in = newEmailRequest
        ? newEmailRequest.expiresIn
        : getState().auth.expirationToken;
      const userImage = newImage ? newImage : getState().user.userImage;
      const authId = getState().auth.authId;

      let expirationDate = newEmailRequest
        ? new Date(new Date().getTime() + parseInt(expires_in) * 1000)
        : new Date(expires_in);

      try {
        // REFRESH TOKEN IF NEEDED
        if (new Date(expirationDate) <= new Date()) {
          const resData = await dispatch(refreshTokenForId(refreshToken));
          expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expires_in) * 1000
          );
          token = resData.id_token;
          refreshToken = resData.refresh_token;
        }

        await dispatch(
          // SAVE CHANGES TO FIREBASE
          saveUserData(
            'update',
            token,
            authId,
            newUserName,
            newUserEmail,
            newUserImage ? newUserImage.base64 : null,
            getState().user.privateId,
            getState().user.publicId
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }

      dispatch(
        // SAVE CHANGES TO REDUX
        authenticate(
          authId,
          token,
          refreshToken,
          expirationDate,
          getState().user.privateId,
          newUserEmail ? newUserEmail : getState().user.email,
          newUserName ? newUserName : getState().user.name,
          getState().user.highestScore,
          userImage
        )
      );

      const rememberMe = await dispatch(checkStorage());

      if (rememberMe) {
        // IF UPDATE DATA IN DEVICE STORAGE
        dispatch(
          saveDataToStorage(
            authId,
            token,
            refreshToken,
            expirationDate,
            getState().user.privateId,
            newUserEmail ? newUserEmail : getState().user.email,
            newUserName ? newUserName : getState().user.name,
            getState().user.highestScore,
            userImage,
            rememberMe.darkTheme
          )
        );
      }

      if (callBackFunc) {
        callBackFunc();
      }
    }
  };
};

// >RELATED TO TESTS:
export const runTest = () => {
  return async () => {
    let endPointUrl;
    let response;
    let dataLogin;
    let dataRefresh;
    let dataChange;

    const login = async () => {
      // >LOGIN
      console.log('LOGIN');
      endPointUrl = config.API_SIGNIN.concat(config.API_KEY);
      response = await fetch(endPointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'v',
          password: '1234567',
          returnSecureToken: true,
        }),
      });
      dataLogin = await response.json();
      console.log(dataLogin);
      console.log('END LOGIN');
      // <LOGIN
    };

    const refresh = async () => {
      // >REFRESH TOKEN
      console.log('REFRESH');
      let endpointUrl = config.API_REFRESH_TOKEN.concat(config.API_KEY);
      const body = new URLSearchParams();
      body.append('grant_type', 'refresh_token');
      body.append('refresh_token', dataLogin.refreshToken);

      response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      dataRefresh = await response.json();
      console.log(dataRefresh);
      console.log('END REFRESH');
      // <REFRESH TOKEN
    };

    const changeEmail = async () => {
      console.log('CHANGE EMAIL');
      // >CHANGE EMAIL
      endPointUrl = config.API_USERS_UPDT.concat(config.API_KEY);
      response = await fetch(endPointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: dataRefresh.id_token,
          email: 'andrews@gmail.com',
          returnSecureToken: true,
        }),
      });
      dataChange = await response.json();
      console.log(dataChange);
      console.log('END CHANGE EMAIL');
      // <CHANGE EMAIL
    };

    await login();
    await refresh();
    await changeEmail();
  };
};

export const logout = () => {
  return async (dispatch) => {
    // CLEAR REDUX AND DEVICE STORAGE
    if (SecureStore.isAvailableAsync()) {
      SecureStore.deleteItemAsync(config.STORAGE);
    } else {
      AsyncStorage.removeItem(config.STORAGE);
    }
    await dispatch(deleteImageFromFileSystem());
    dispatch({ type: LOGOUT });
  };
  // try {
  //   await dispatch(
  //     saveDataToStorage(
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       0,
  //       null,
  //       'auto'
  //     )
  //   );
  //   await dispatch(deleteImageFromFileSystem());
  //   dispatch({ type: LOGOUT });
  // } catch (err) {
  //   throw new Error(err);
  // }
  // };
};

export const deleteUserAccount = (token = null) => {
  return async (dispatch) => {
    try {
      await dispatch(deleteAccount(token));
      dispatch(logout());
    } catch (error) {
      throw new Error(error.message);
    }
  };
};

// REVIEWED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const validateUserName = (userName) => {
  // FETCH PUBLIC USER INFO FROM REALTIME DATABASE
  return async () => {
    const body = new URLSearchParams();
    body.append('orderBy', '"name"');
    body.append('equalTo', '"' + userName + '"');
    const endPointUrl = config.API_USERS_PUBLIC.concat(body.toString());
    const response = await fetch(endPointUrl);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
    }

    if (Object.keys(data).length > 0) {
      return false;
    }
    return true;
  };
};
