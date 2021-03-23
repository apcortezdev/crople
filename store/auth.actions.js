import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import config from '../config';
import { AUTHENTICATE } from './actionConstants';

export const signUpOrIn = (action, email, password) => {
  return async () => {
    let endPointUrl;
    switch (action) {
      case 'signup':
        endPointUrl = config.API_SIGNUP.concat(config.API_KEY);
        break;
      case 'login':
        endPointUrl = config.API_SIGNIN.concat(config.API_KEY);
        break;
      default:
        throw new Error('400: Wrong action');
    }
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
        errMessage =
          action === 'signup'
            ? 'This e-mail is already registered. Please use a different one.'
            : 'The e-mail or password is invalid';
      else
        errMessage =
          'There is a problem with the connection. Please try again latter. ';
      throw new Error(errMessage);
    }

    return await response.json();
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
  userImage = null,
  darkTheme = false
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
      darkTheme: darkTheme,
    });
  };
};

export const deleteAccount = (token = null) => {
  return async (dispatch, getState) => {
    const endPointUrl = config.API_DEL_ACC.concat(config.API_KEY);

    const response = await fetch(endPointUrl, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token ? token : getState().auth.userToken,
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

export const refreshTokenForId = (refreshToken = null) => {
  // EXCHANGE REFRESH TOKEN FOR NEW ID TOKEN
  return async () => {
    const endpointUrl = config.API_REFRESH_TOKEN.concat(config.API_KEY);
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append(
      'refresh_token',
      refreshToken ? refreshToken : getState().auth.refreshToken
    );

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    return data;
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

export const checkStorage = () => {
  // CHECKS EXISTENCE OF DATA IN STORAGE
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
  userImage = null,
  darkTheme = false
) => {
  return async () => {
    if (SecureStore.isAvailableAsync()) {
      // ID SECURE CRIPTOGRAPHY AVAILABLE
      try {
        await SecureStore.setItemAsync(
          config.STORAGE,
          JSON.stringify({
            token: token,
            expiryDate:
            expirationDate ? 
              (typeof expirationDate === 'object'
                ? expirationDate.toISOString()
                : expirationDate) :
                null,
            refreshToken: refreshToken,
            userId: userId,
            infoId: infoId,
            userEmail: userEmail,
            userName: userName,
            highestScore: highestScore,
            userImage: userImage,
            darkTheme: darkTheme,
          })
        );
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      try {
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
            darkTheme: darkTheme,
          })
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };
};
