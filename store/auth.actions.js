import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import config from '../config';
import { AUTHENTICATE, LOGOUT, REFRESH_IMAGE } from './actionConstants';
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
    let endPointUrl;
    if (action === 'signup')
      endPointUrl = config.API_SIGNUP.concat(config.API_KEY);
    else if (action === 'login')
      endPointUrl = config.API_SIGNIN.concat(config.API_KEY);
    else throw new Error('WRONG ACTION');

    const response = await fetch(endPointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      let errMessage;
      if (response.status === 400)
        if (action === 'signup')
          errMessage =
            'This e-mail is already registered. Please use a different one.';
        else errMessage = 'The e-mail or password is invalid';
      else if (action === 'login')
        errMessage =
          'There is a problem with the connection. Please try again latter. ';
      throw new Error(errMessage);
    }

    const resData = await response.json();

    let infoId;
    let highestScore = 0;
    let imageUri = null;
    if (action === 'signup') {
      // IF IS NEW USER, USER DETAILS HAVE TO BE SAVED
      try {
        infoId = await dispatch(
          saveUserData(
            'create',
            resData.idToken,
            resData.localId,
            userName,
            email,
            !!userImg && userImg.base64,
            null
          )
        );
      } catch (err) {
        throw new Error(err.message);
      }
    } else if (action === 'login') {
      try {
        const userInfo = await dispatch(
          fetchUserData(resData.idToken, resData.localId)
        );
        infoId = Object.keys(userInfo)[0];
        userName = userInfo[Object.keys(userInfo)[0]].userName;
        email = userInfo[Object.keys(userInfo)[0]].userEmail;
        highestScore = userInfo[Object.keys(userInfo)[0]].highestScore;
        userImg = { base64: userInfo[Object.keys(userInfo)[0]].userImage };
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const expirationDate = new Date(
      // TURNS EXPIRATION TIME (MILLISECONDS) INTO A DATE FOR FUTURE COMPARISON
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    // DELETE IMAGE FROM STORAGE CASE NEW USER WITH NO PIC
    if (userImg === null || !userImg.base64) {
      deleteImageFromFileSystem();
    } else {
      imageUri = await dispatch(saveImageToFileSystem(userImg));
    }

    dispatch(
      // SAVE USER INFO TO REDUX
      authenticate(
        resData.localId,
        resData.idToken,
        resData.refreshToken,
        expirationDate,
        infoId,
        email,
        userName,
        highestScore,
        imageUri
      )
    );

    if (rememberMe) {
      // SAVE USER INFO TO DEVICE STORAGE IF REMEMBER-ME OPTION IS ON
      dispatch(
        saveDataToStorage(
          resData.localId,
          resData.idToken,
          resData.refreshToken,
          expirationDate,
          infoId,
          email,
          userName,
          highestScore,
          imageUri
        )
      );
    }
  };
};

export const saveImageToFileSystem = (userImage) => {
  // SAVE USER PICTURE TO FILE WHEN LOGIN OR SIGNUP OR UPDATE
  return async () => {
    const path = FileSystem.documentDirectory + config.STORAGE + '.jpg';

    if (!!!userImage.uri) {
      // IMAGE DOWNLOADED, MUST CONVERT TO FILE
      try {
        await FileSystem.writeAsStringAsync(path, userImage.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
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

export const deleteImageFromFileSystem = () => {
  // IF A USER LOGS WITH PIC, THE PIC IS SAVED TO STORAGE,
  // BUT IF THE USER LOGS OFF AND A SECOND USER LOGS IN WITH NO PIC
  // THE FIRST USERS PIC MUST BE DELETED
  return async () => {
    const path = FileSystem.documentDirectory + config.STORAGE + '.jpg';
    try {
      await FileSystem.deleteAsync(path, {
        idempotent: true,
      });
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
      const infoId = await response.json();
      return infoId.name;
    }
  };
};

export const deleteAccount = (token) => {
  return async (dispatch) => {
    const endPointUrl = config.API_DEL_ACC.concat(config.API_KEY);

    const response = await fetch(endPointUrl, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
    }
    dispatch(logout());
  };
};

export const validateUserName = (userName) => {
  // FETCH USER DETAILS FROM REALTIME DATABASE
  return async () => {
    const body = new URLSearchParams();
    body.append('orderBy', '"userName"');
    body.append('equalTo', '"' + userName + '"');
    const endPointUrl = config.API_USERS.concat(body.toString());
    const response = await fetch(endPointUrl);

    const data = await response.json();

    if (!response.ok) {
      if (data.error === 'Permission denied')
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

export const fetchUserData = (token, userId) => {
  // FETCH USER DETAILS FROM REALTIME DATABASE
  return async () => {
    const body = new URLSearchParams();
    body.append('orderBy', '"userId"');
    body.append('equalTo', '"' + userId + '"');
    body.append('auth', token);
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

export const changeUserEmail = (newEmail) => {
  return async (dispatch, getState) => {
    if (!!newEmail) {
      if (new Date(getState().auth.expirationToken) <= new Date()) {
        const resData = await dispatch(
          refreshTokenForId(getState().auth.refreshToken)
        );
        const expirationDate = new Date(
          new Date().getTime() + parseInt(resData.expires_in) * 1000
        );
        await dispatch(
          // SAVE NEW TOKEN TO REDUX
          authenticate(
            getState().auth.userId,
            resData.id_token,
            resData.refresh_token,
            expirationDate,
            getState().game.infoId, // GETS PROP NAME (THIS NAME IS THE INFO ID)
            getState().game.userEmail,
            getState().game.userName,
            getState().game.highestScore,
            getState().game.userImage
          )
        );
      }

      const userToken = resData.id_token;
      const endPointUrl = config.API_USERS_UPDT.concat(config.API_KEY);

      const body = JSON.stringify({
        idToken: userToken,
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

      console.log(endPointUrl);
      console.log(body);

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error('Errors are bad.. and you just found one');
      } else {
      }
      const data = await response.json();
      console.log(data);
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
        getState().temps.settings.userEmail === getState().game.userEmail ||
        getState().temps.settings.userEmail === null
      ) {
        newUserEmail = getState().game.userEmail;
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
        (getState().temps.settings.userImage.uri === getState().game.userImage
          ? null
          : getState().temps.settings.userImage);

      if (!!newUserImage) {
        // SAVE NEW IMAGE TO FILE SYSTEM
        try {
          newImage = await dispatch(saveImageToFileSystem(newUserImage));
          // CLEAR CACHE BEFORE SETTING NEW IMAGE
          dispatch({ type: REFRESH_IMAGE });
        } catch (err) {
          throw new Error(err.message);
        }
      }

      // IF EQUAL TO OLD INFO OR NULL, KEEP OLD INFO, ELSE, SET NEW ONE
      const newUserName =
        getState().temps.settings.userName === getState().game.userName ||
        getState().temps.settings.userName === null
          ? getState().game.userName
          : getState().temps.settings.userName;

      const token = newEmailRequest
        ? newEmailRequest.idToken
        : getState().auth.userToken;
      const refreshToken = newEmailRequest
        ? newEmailRequest.refreshToken
        : getState().auth.refreshToken;
      const expires_in = newEmailRequest
        ? newEmailRequest.expiresIn
        : getState().auth.expirationToken;
      const userImage = newImage ? newImage : getState().game.userImage;
      const userId = getState().auth.userId;
      let expirationDate = new Date(expires_in);

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
            getState().game.infoId
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
          getState().game.infoId,
          newUserEmail ? newUserEmail : getState().game.userEmail,
          newUserName ? newUserName : getState().game.userName,
          getState().game.highestScore,
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
            getState().game.infoId,
            newUserEmail ? newUserEmail : getState().game.userEmail,
            newUserName ? newUserName : getState().game.userName,
            getState().game.highestScore,
            userImage
          )
        );
      }

      if (callBackFunc) {
        callBackFunc();
      }
    }
  };
};

export const authenticate = (
  userId,
  token,
  refreshToken,
  expiresIn,
  infoId,
  userEmail,
  userName,
  highestScore,
  userImage = null
) => {
  // SAVE USER INFO TO REDUX
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      infoId: infoId,
      userEmail: userEmail,
      userName: userName,
      highestScore: highestScore,
      userImage: userImage,
    });
  };
};

export const logout = () => {
  // CLEAR REDUX AND DEVICE STORAGE( IF EXISTS)
  if (SecureStore.isAvailableAsync()) {
    SecureStore.deleteItemAsync(config.STORAGE);
  } else {
    AsyncStorage.removeItem(config.STORAGE);
  }
  return { type: LOGOUT };
};

export const saveDataToStorage = (
  // SAVE USER INFO TO DEVICE STORAGE FOR REMEMBER-ME FUNCTION
  userId,
  token,
  refreshToken,
  expirationDate,
  infoId,
  userEmail,
  userName,
  highestScore,
  userImage = null
) => {
  return async () => {
    if (SecureStore.isAvailableAsync()) {
      // ID SECURE CRIPTOGRAPHY AVAILABLE
      await SecureStore.setItemAsync(
        config.STORAGE,
        JSON.stringify({
          token: token,
          expiryDate:
            typeof expirationDate === 'object'
              ? expirationDate.toISOString()
              : expirationDate,
          refreshToken: refreshToken,
          userId: userId,
          infoId: infoId,
          userEmail: userEmail,
          userName: userName,
          highestScore: highestScore,
          userImage: userImage,
        })
      );
    } else {
      await AsyncStorage.setItem(
        config.STORAGE,
        JSON.stringify({
          token: token,
          expiryDate:
            typeof expirationDate === 'object'
              ? expirationDate.toISOString()
              : expirationDate,
          refreshToken: refreshToken,
          userId: userId,
          infoId: infoId,
          userEmail: userEmail,
          userName: userName,
          highestScore: highestScore,
          userImage: userImage,
        })
      );
    }
  };
};

const refreshTokenForId = (refreshToken) => {
  // EXCHANGE REFRESH TOKEN FOR NEW ID TOKEN
  return async () => {
    const endpointUrl = config.API_REFRESH_TOKEN.concat(config.API_KEY);
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refreshToken);

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
      json: true,
    });

    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    return data;
  };
};

export const checkStorage = () => {
  return async () => {
    const dataFromStorage = SecureStore.isAvailableAsync()
      ? await SecureStore.getItemAsync(config.STORAGE)
      : await AsyncStorage.getItem(config.STORAGE);

    if (!dataFromStorage) {
      return false;
    }
    return await JSON.parse(dataFromStorage);
  };
};

export const refreshAndSaveToken = (refreshToken) => {
  // THIS WILL FETCH AND SAVE A NEW TOKEN TO REDUX AND THE STORAGE, WITHOUT FETCHING USER DATA
  return async (dispatch, getState) => {
    const resData = await dispatch(refreshTokenForId(refreshToken));

    const rememberMe = await dispatch(checkStorage());

    const expirationDate = new Date(
      // TURNS EXPIRATION TIME (MILISECONDS) INTO A DATE FOR FUTURE COMPARISON
      new Date().getTime() + parseInt(resData.expires_in) * 1000
    );

    const infoId = getState().game.infoId;
    const userEmail = getState().game.userEmail;
    const userName = getState().game.userName;
    const highestScore = getState().game.highestScore;
    const userImage = getState().game.userImage;

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
        userImage
      )
    );

    if (rememberMe) {
      // IF UPDATE DATA IN DEVICE STORAGE
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
          userImage
        )
      );
    }
  };
};

export const refreshTokenAndAuthenticate = (
  // THIS WILL FETCH AND SAVE A NEW TOKEN TO REDUX AND THE STORAGE AND FETCH USER DATA FOR LOGIN
  refreshToken,
  userImage,
  rememberMe = false
) => {
  return async (dispatch) => {
    const resData = await dispatch(refreshTokenForId(refreshToken));

    const expirationDate = new Date(
      // TURNS EXPIRATION TIME (MILISECONDS) INTO A DATE FOR FUTURE COMPARISON
      new Date().getTime() + parseInt(resData.expires_in) * 1000
    );

    const userInfo = await dispatch(
      fetchUserData(resData.id_token, resData.user_id)
    ).catch(() => {
      throw new Error('Failed to get user infos');
    });

    // userInfo RETURNS WITH user OBJECT INSIDE A PROPERTY THAT GOES BY THE NAME OF ITS ID
    // AS WE DON'T KNOW THIS ID, TO ACCES THIS PROPERTY WE DO AS BELOW:
    // userInfo[Object.keys(userInfo)[0]].userName
    // DONT FREAK OUT AS IT'S GARANTEED THIS IS THE ONLY PROPERTY OF userInfo

    dispatch(
      // SAVE NEW TOKEN TO REDUX
      authenticate(
        resData.user_id,
        resData.id_token,
        resData.refresh_token,
        expirationDate,
        Object.keys(userInfo)[0], // GETS PROP NAME (THIS NAME IS THE INFO ID)
        userInfo[Object.keys(userInfo)[0]].userEmail,
        userInfo[Object.keys(userInfo)[0]].userName,
        userInfo[Object.keys(userInfo)[0]].highestScore,
        userImage
      )
    );

    if (rememberMe) {
      // IF UPDATE DATA IN DEVICE STORAGE
      dispatch(
        saveDataToStorage(
          resData.user_id,
          resData.id_token,
          resData.refresh_token,
          expirationDate,
          Object.keys(userInfo)[0],
          userInfo[Object.keys(userInfo)[0]].userEmail,
          userInfo[Object.keys(userInfo)[0]].userName,
          userInfo[Object.keys(userInfo)[0]].highestScore,
          userImage
        )
      );
    }
  };
};

export const resetPassword = (userEmail) => {
  // RESET PASSWORD WITH REALTIME DATABESE IN FIREBASE
  return async () => {
    const endPointUrl = config.API_RESET_PASS.concat(config.API_KEY);

    const response = await fetch(endPointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error();
    }
  };
};
