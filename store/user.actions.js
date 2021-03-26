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
import User from '../models/User';

export const signupOrLogin = (
  // SIGN UP OR LOGIN IN FIREBASE AUTHENTICATION WITH EMAIL AND PASSWORD
  action,
  email,
  password,
  rememberMe,
  name = null,
  image = null,
  clear = true
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

      if (rememberMe || storage.token) {
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
      if (clear) {
        await dispatch(clearSettings());
      }
    } catch (err) {
      console.log(err.message);
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
    let privateBody = {};
    let publicBody = {};
    let response;
    if (action === 'create') {
      urlPrivateUser = config.API_USERS.concat('auth='.concat(token));
      urlPublicUser = config.API_USERS_PUBLIC.concat('auth='.concat(token));
      method = 'POST';
      privateBody.name = publicBody.name = user.name;
      privateBody.email = user.email;
      privateBody.authId = publicBody.authId = user.authId;
      privateBody.highestScore = publicBody.highestScore = 0;
      if (user.image) {
        privateBody.image = publicBody.image = user.image.base64;
      }
    } else if (action === 'update') {
      urlPrivateUser = config.API_USERS_POSTA.concat(user.privateId)
        .concat(config.API_USERS_AUTH)
        .concat(token);
      urlPublicUser = config.API_USERS_PUBLIC_POSTA.concat(user.publicId)
        .concat(config.API_USERS_AUTH)
        .concat(token);
      method = 'PATCH';
      if (user.email) privateBody.email = user.email;
      if (user.name) privateBody.name = publicBody.name = user.name;
      if (user.highestScore)
        privateBody.highestScore = publicBody.highestScore = user.highestScore;
      if (user.image) {
        privateBody.image = publicBody.image = user.image.base64;
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
      if (data.error.message === 'Permission denied') {
        throw new Error(
          "There's something wrong with our servers. Please try again later =(("
        );
      } else {
        throw new Error(data.error.message);
      }
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

export const refreshToken = () => {
  // THIS WILL FETCH AND SAVE A NEW TOKEN TO REDUX AND THE STORAGE, WITHOUT FETCHING USER DATA
  return async (dispatch, getState) => {
    try {
      const storage = await dispatch(checkStorage());

      const resData = await dispatch(
        refreshTokenForId(getState().auth.refreshToken)
      );

      const authId = getState().auth.authId;
      const privateId = getState().user.privateId;
      const publicId = getState().user.publicId;
      const email = getState().user.email;
      const name = getState().user.name;
      const highestScore = getState().user.highestScore;
      const image = getState().user.image;
      const darkTheme = getState().game.darkTheme;

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expires_in) * 1000
      );

      await dispatch(
        // SAVE NEW TOKEN TO REDUX
        authenticate(
          authId,
          resData.id_token,
          resData.refresh_token,
          expirationDate,
          privateId,
          publicId,
          email,
          name,
          highestScore,
          image,
          darkTheme
        )
      );

      if (storage.token) {
        // IF UPDATE DATA IN DEVICE STORAGE
        await dispatch(
          saveDataToStorage(
            authId,
            resData.id_token,
            resData.refresh_token,
            expirationDate,
            privateId,
            publicId,
            email,
            name,
            highestScore,
            image,
            darkTheme
          )
        );
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const saveImageToFileSystem = (userName, image) => {
  // SAVE USER PICTURE TO FILE WHEN LOGIN OR SIGNUP OR UPDATE
  return async () => {
    let path;

    if (!image.uri) {
      // IMAGE DOWNLOADED, MUST CONVERT TO FILE
      path = FileSystem.documentDirectory + userName.toString() + '.jpg';
      try {
        await FileSystem.writeAsStringAsync(path, image.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    } else {
      path = FileSystem.documentDirectory + image.uri.split('/').pop();
      try {
        await FileSystem.moveAsync({
          //saves file from temp folder to filesystem
          from: image.uri,
          to: path,
        });
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    }
    return path;
  };
};

export const deleteImageFromFileSystem = (file = null) => {
  return async (_, getState) => {
    const path = file ? file : getState().user.image;
    if (path) {
      try {
        await FileSystem.deleteAsync(path, {
          idempotent: true,
        });
      } catch (err) {
        console.log(err);
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
    try {
      if (new Date(getState().auth.expirationToken) <= new Date()) {
        await dispatch(refreshToken());
      }

      const user = new User(
        getState().auth.authId,
        getState().user.privateId,
        null,
        null,
        null,
        newRecord
      );

      await dispatch(saveUserData('update', getState().auth.token, user));

      // SAVE RECORD TO DEVICE STORAGE
      const storage = await dispatch(checkStorage());
      if (storage.token) {
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
      }
      dispatch({ type: SET_NEW_RECORD, points: newRecord });
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const changeUserEmail = (newEmail) => {
  return async (dispatch, getState) => {
    if (newEmail) {
      const endPointUrl = config.API_USERS_UPDT_EMAIL.concat(config.API_KEY);
      const headers = { 'Content-Type': 'application/json' };
      const body = {
        idToken: getState().auth.token,
        email: newEmail,
        returnSecureToken: true,
      };

      try {
        const response = await dispatch(
          fetchFirebase(endPointUrl, 'POST', headers, body)
        );

        await dispatch(
          // SAVE TO REDUX
          authenticate(
            response.localId,
            response.idToken,
            response.refreshToken,
            new Date(
              new Date().getTime() + parseInt(response.expiresIn) * 1000
            ),
            getState().user.privateId,
            getState().user.publicId,
            newEmail,
            getState().user.name,
            getState().user.highestScore,
            getState().user.image,
            getState().game.darkTheme
          )
        );

        const storage = await dispatch(checkStorage());
        if (storage.token) {
          dispatch(
            saveDataToStorage(
              response.localId,
              response.idToken,
              response.refreshToken,
              new Date(
                new Date().getTime() + parseInt(response.expiresIn) * 1000
              ),
              getState().user.privateId,
              getState().user.publicId,
              newEmail,
              getState().user.name,
              getState().user.highestScore,
              getState().user.image,
              getState().game.darkTheme
            )
          );
        }
        return newEmail;
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      throw new Error('Param EMAIL cannot be empty value!');
    }
  };
};

export const updateUserData = (password) => {
  return async (dispatch, getState) => {
    if (getState().temps.pending) {
      try {
        console.log('HEY');

        const email = getState().user.email;
        await dispatch(
          signupOrLogin('login', email, password, false, null, null, false)
        );

        console.log('LOGGED');

        // HANDLE NEW EMAIL:
        const oldEmail = getState().user.email;
        const newEmail = getState().temps.settings.email;
        if (!!newEmail && newEmail != oldEmail) {
          await dispatch(changeUserEmail(newEmail));
          console.log('EMAIL UPDATED');
          console.log('NEW EMAIL: ' + newEmail);
        }

        // HANDLE NEW NAME AND IMAGE
        const oldName = getState().user.name;
        const newName = getState().temps.settings.name;

        const oldImage = getState().user.image;
        const newImage = getState().temps.settings.image;

        let newImgPath = null;
        let image = null;
        if (!!newImage && newImage.uri != oldImage) {
          await dispatch(deleteImageFromFileSystem());
          newImgPath = await dispatch(
            saveImageToFileSystem(newName ? newName : oldName, newImage)
          );
          await dispatch({ type: REFRESH_IMAGE });
          console.log('IMAGE SAVED');
          console.log('NEW IMAGE: ' + newImgPath);
        }

        const authId = getState().auth.authId;
        const token = getState().auth.token;

        if (newImgPath) {
          image = {
            uri: newImgPath,
            base64: newImage.base64,
          };
        }

        const user = new User(
          authId,
          getState().user.privateId,
          getState().user.publicId,
          newName ? newName : oldName,
          newEmail ? newEmail : oldEmail,
          image,
          null
        );

        await dispatch(
          // SAVE CHANGES TO FIREBASE
          saveUserData('update', token, user)
        );

        console.log('FIREBASE UPDATED');
        console.log('NEW NAME: ' + newName);

        await dispatch(
          // SAVE CHANGES TO REDUX
          authenticate(
            authId,
            token,
            getState().auth.refreshToken,
            getState().auth.expirationToken,
            getState().user.privateId,
            getState().user.publicId,
            newEmail ? newEmail : oldEmail,
            newName ? newName : oldName,
            getState().user.highestScore,
            newImgPath ? newImgPath : oldImage,
            getState().game.darkTheme
          )
        );

        console.log('AUTHENTICATED');

        const storage = await dispatch(checkStorage());
        if (storage.token) {
          // IF REMEMBER ME
          await dispatch(
            saveDataToStorage(
              authId,
              token,
              getState().auth.refreshToken,
              getState().auth.expirationToken,
              getState().user.privateId,
              getState().user.publicId,
              newEmail ? newEmail : oldEmail,
              newName ? newName : oldName,
              getState().user.highestScore,
              newImgPath ? newImgPath : oldImage,
              getState().game.darkTheme
            )
          );
        }
        console.log('SAVED TO STORAGE');
        dispatch(clearSettings());
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    // CLEAR REDUX AND DEVICE STORAGE
    try {
      await dispatch(
        saveDataToStorage(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          0,
          null,
          'auto'
        )
      );
      await dispatch(deleteImageFromFileSystem());
      dispatch({ type: LOGOUT });
    } catch (err) {
      throw new Error(err);
    }
  };
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
