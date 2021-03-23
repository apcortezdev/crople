import { Alert } from 'react-native';
import config from '../config';
import { SET_NEW_RECORD, LOGOUT, REFRESH_IMAGE } from './actionConstants';
import {
  signUpOrIn,
  checkStorage,
  refreshTokenForId,
  saveDataToStorage,
  authenticate,
} from './auth.actions';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

export const signupOrLogin = (
  // SIGN UP OR LOGIN IN FIREBASE AUTHENTICATION WITH EMAIL AND PASSWORD
  action,
  email,
  password,
  rememberMe,
  userName = null,
  userImg = null
) => {
  return async (dispatch) => {
    let infoId;
    let highestScore = 0;
    let imageUri = null;
    let storage = null;

    try {
      const storage = await dispatch(checkStorage());
      const signUpOrInResponse = await dispatch(
        signUpOrIn(action, email, password)
      );

      if (action === 'signup') {
        infoId = await dispatch(
          saveUserData(
            'create',
            signUpOrInResponse.idToken,
            signUpOrInResponse.localId,
            userName,
            email,
            !!userImg && userImg.base64,
            null
          )
        );
      } else {
        const userInfo = await dispatch(
          fetchUserData(signUpOrInResponse.idToken, signUpOrInResponse.localId)
        );
        infoId = Object.keys(userInfo)[0];
        userName = userInfo[Object.keys(userInfo)[0]].userName;
        email = userInfo[Object.keys(userInfo)[0]].userEmail;
        highestScore = userInfo[Object.keys(userInfo)[0]].highestScore;
        userImg = { base64: userInfo[Object.keys(userInfo)[0]].userImage };
      }

      const expirationDate = new Date(
        new Date().getTime() + parseInt(signUpOrInResponse.expiresIn) * 1000
      );

      if (userImg.base64) {
        imageUri = await dispatch(saveImageToFileSystem(userName, userImg));
      }

      dispatch(
        // SAVE USER INFO TO REDUX
        authenticate(
          signUpOrInResponse.localId,
          signUpOrInResponse.idToken,
          signUpOrInResponse.refreshToken,
          expirationDate,
          infoId,
          email,
          userName,
          highestScore,
          imageUri,
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
            infoId,
            email,
            userName,
            highestScore,
            imageUri,
            storage.darkTheme
          )
        );
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const saveUserData = (
  action,
  token,
  userId,
  userName,
  userEmail,
  userImage = null,
  userInfoId = null
) => {
  // SAVE USER DETAILS TO REALTIME DATABASE AFTER NEW SIGN UP
  return async (dispatch) => {
    let endPointUrl;
    let body;
    let method;
    if (action === 'create') {
      endPointUrl = config.API_USERS.concat('auth='.concat(token));
      method = 'POST';
      body = JSON.stringify({
        userId,
        userName,
        userEmail,
        highestScore: 0,
        userImage,
      });
    } else if (action === 'update') {
      endPointUrl = config.API_USERS_DPI.concat(userInfoId)
        .concat(config.API_USERS_DPA)
        .concat(token);
      method = 'PATCH';
      if (userImage) {
        body = JSON.stringify({
          userName,
          userEmail,
          userImage,
        });
      } else {
        body = JSON.stringify({
          userName,
          userEmail,
        });
      }
    } else {
      throw new Error('400: Wrong action');
    }

    const response = await fetch(endPointUrl, {
      method: method,
      header: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      if (action === 'create') {
        await dispatch(deleteAccount(token));
      }
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
    } else {
      await dispatch(savePublicUserData(action, token, userId, userName));
      const infoId = await response.json();
      return infoId.name;
    }
  };
};

export const savePublicUserData = (
  action,
  token,
  userId,
  userName,
  highestScore = null
) => {
  // SAVE PUBLIC USER DETAILS TO REALTIME DATABASE AFTER NEW SIGN UP
  return async (dispatch) => {
    let endPointUrl;
    let body;
    let method;
    if (action === 'create') {
      endPointUrl = config.API_USERS_PUBLIC.concat('auth='.concat(token));
      method = 'POST';
      body = JSON.stringify({
        userId,
        userName,
        highestScore: 0,
      });
    } else if (action === 'update') {
      endPointUrl = config.API_USERS_PUBLIC_DPI.concat(userInfoId)
        .concat(config.API_USERS_DPA)
        .concat(token);
      method = 'PATCH';
      if (highestScore) {
        body = JSON.stringify({
          userName,
          highestScore,
        });
      } else {
        body = JSON.stringify({
          userName,
        });
      }
    } else {
      throw new Error('400: Wrong action');
    }

    const response = await fetch(endPointUrl, {
      method: method,
      header: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error('Not able to save');
    } else {
      const infoId = await response.json();
      return infoId.name;
    }
  };
};

export const validateUserName = (userName) => {
  // FETCH USER DETAILS FROM REALTIME DATABASE
  return async () => {
    const body = new URLSearchParams();
    body.append('orderBy', '"userName"');
    body.append('equalTo', '"' + userName + '"');
    const endPointUrl = config.API_USERS_PUBLIC.concat(body.toString());
    const response = await fetch(endPointUrl);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
    }

    if (!!data.userName) {
      return false;
    }
    return true;
  };
};

export const fetchUserData = (token = null, userId = null) => {
  // FETCH USER DETAILS FROM REALTIME DATABASE
  return async (_, getState) => {
    const body = new URLSearchParams();
    body.append('orderBy', '"userId"');
    body.append(
      'equalTo',
      '"'.concat(userId ? userId : getState().user.infoId).concat('"')
    );
    body.append('auth', token ? token : getState().auth.userToken);
    const endPointUrl = config.API_USERS.concat(body.toString());

    const response = await fetch(endPointUrl);
    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'Permission denied')
        throw new Error(
          "There's something wrong with our servers. Please try again later =(("
        );
    }

    return data;
  };
};

export const refreshToken = ({ from, authentication }) => {
  // THIS WILL FETCH AND SAVE A NEW TOKEN TO REDUX AND THE STORAGE, WITHOUT FETCHING USER DATA
  return async (dispatch, getState) => {
    const storage = await dispatch(checkStorage());

    let infoId;
    let userEmail;
    let userName;
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
          infoId = Object.keys(userInfo)[0];
          userEmail = userInfo[Object.keys(userInfo)[0]].userEmail;
          userName = userInfo[Object.keys(userInfo)[0]].userName;
          highestScore = userInfo[Object.keys(userInfo)[0]].highestScore;
          userImage = storage.userImage;
        } catch (err) {
          throw new Error('Failed to get user infos');
        }
        break;
      case 'storage':
        resData = await dispatch(refreshTokenForId(storage.refreshToken));
        infoId = storage.infoId;
        userEmail = storage.userEmail;
        userName = storage.userName;
        highestScore = storage.highestScore;
        userImage = storage.userImage;
        break;
      case 'redux':
      default:
        resData = await dispatch(
          refreshTokenForId(getState().auth.refreshToken)
        );
        infoId = getState().user.infoId;
        userEmail = getState().user.userEmail;
        userName = getState().user.userName;
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
            infoId,
            userEmail,
            userName,
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
            infoId,
            userEmail,
            userName,
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
  return async (dispatch) => {
    let path;

    if (!!!userImage.uri) {
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
        FileSystem.documentDirectory + userImage.uri.split('/').pop() + '.jpg';
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

export const logout = () => {
  return async (dispatch) => {
    // CLEAR REDUX AND DEVICE STORAGE( IF EXISTS)
    if (SecureStore.isAvailableAsync()) {
      SecureStore.deleteItemAsync(config.STORAGE);
    } else {
      AsyncStorage.removeItem(config.STORAGE);
    }
    await dispatch(deleteImageFromFileSystem());
    dispatch({ type: LOGOUT });
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
            storage.userId,
            storage.token,
            storage.refreshToken,
            storage.expiryDate,
            storage.infoId,
            storage.userEmail,
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
      getState().user.infoId.concat(
        config.API_USERS_DPA.concat(getState().auth.userToken)
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
    if (!!newEmail) {
      if (new Date(getState().auth.expirationToken) <= new Date()) {
        await dispatch(refreshToken({ from: 'redux', authentication: true }));
      }

      const endPointUrl = config.API_USERS_UPDT.concat(config.API_KEY);

      const body = JSON.stringify({
        idToken: getState().auth.userToken,
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
      } else {
      }
      const data = await response.json();
      return data;
    }
    return false;
  };
};

export const updateUserData = (callBackFunc) => {
  return async (dispatch, getState) => {
    if (!!getState().temps.pending) {
      let newEmailRequest = null;
      let newImage = null;
      let newUserEmail;

      // IF EQUAL TO OLD INFO OR NULL, KEEP OLD INFO, ELSE, SET NEW ONE
      if (
        getState().temps.settings.userEmail === getState().user.userEmail ||
        getState().temps.settings.userEmail === null
      ) {
        newUserEmail = getState().user.userEmail;
        newEmailRequest = null;
      } else {
        newUserEmail = getState().temps.settings.userEmail;
        newEmailRequest = getState().temps.settings.userEmail;
      }

      if (!!newEmailRequest) {
        // SAVE NEW EMAIL (AND CHANGE EMAIL FOR LOGIN)
        try {
          newEmailRequest = await dispatch(changeUserEmail(newUserEmail));
        } catch (err) {
          throw new Error(err.message);
        }
      }

      const newUserImage =
        !!getState().temps.settings.userImage &&
        (getState().temps.settings.userImage.uri === getState().user.userImage
          ? null
          : getState().temps.settings.userImage);

      // IF EQUAL TO OLD INFO OR NULL, KEEP OLD INFO, ELSE, SET NEW ONE
      const newUserName =
        getState().temps.settings.userName === getState().user.userName ||
        getState().temps.settings.userName === null
          ? getState().user.userName
          : getState().temps.settings.userName;

      if (!!newUserImage) {
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

      const token = newEmailRequest
        ? newEmailRequest.idToken
        : getState().auth.userToken;
      const refreshToken = newEmailRequest
        ? newEmailRequest.refreshToken
        : getState().auth.refreshToken;
      const expires_in = newEmailRequest
        ? newEmailRequest.expiresIn
        : getState().auth.expirationToken;
      const userImage = newImage ? newImage : getState().user.userImage;
      const userId = getState().auth.userId;

      let expirationDate = newEmailRequest
        ? new Date(
            new Date().getTime() + parseInt(newEmailRequest.expiresIn) * 1000
          )
        : new Date(getState().auth.expirationToken);

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
            userId,
            newUserName,
            newUserEmail,
            newUserImage ? newUserImage.base64 : null,
            getState().user.infoId
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }

      dispatch(
        // SAVE CHANGES TO REDUX
        authenticate(
          userId,
          token,
          refreshToken,
          expirationDate,
          getState().user.infoId,
          newUserEmail ? newUserEmail : getState().user.userEmail,
          newUserName ? newUserName : getState().user.userName,
          getState().user.highestScore,
          userImage
        )
      );

      const rememberMe = await dispatch(checkStorage());

      if (rememberMe) {
        // IF UPDATE DATA IN DEVICE STORAGE
        dispatch(
          saveDataToStorage(
            userId,
            token,
            refreshToken,
            expirationDate,
            getState().user.infoId,
            newUserEmail ? newUserEmail : getState().user.userEmail,
            newUserName ? newUserName : getState().user.userName,
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
