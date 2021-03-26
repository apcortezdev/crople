import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import config from '../config';
import { AUTHENTICATE } from './actionConstants';

export const refreshTokenForId = (refreshToken = null) => {
  // EXCHANGE REFRESH TOKEN FOR NEW ID TOKEN
  return async (dispatch, getState) => {
    const endpointUrl = config.API_REFRESH_TOKEN.concat(config.API_KEY);
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append(
      'refresh_token',
      refreshToken ? refreshToken : getState().auth.refreshToken
    );

    try {
      const response = await dispatch(
        fetchFirebase(endpointUrl, 'POST', headers, body.toString())
      );
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const resetPassword = (email) => {
  // RESET PASSWORD WITH REALTIME DATABESE IN FIREBASE
  return async (dispatch) => {
    const endPointUrl = config.API_RESET_PASS.concat(config.API_KEY);
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      requestType: 'PASSWORD_RESET',
      email: email,
    }
    try {
      await dispatch(fetchFirebase(endPointUrl, 'POST', headers, body));
    } catch (err) {
      throw new Error(err.message);
    }
  };
};

export const signUpOrIn = (action, email, password) => {
  return async (dispatch) => {
    let response;
    let endPointUrl;
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      email,
      password,
      returnSecureToken: true,
    };

    if (action === 'signup') {
      endPointUrl = config.API_SIGNUP.concat(config.API_KEY);
    } else if (action === 'login') {
      endPointUrl = config.API_SIGNIN.concat(config.API_KEY);
    } else {
      console.log('400: Wrong action');
      throw new Error('400: Wrong action');
    }

    try {
      response = await dispatch(
        fetchFirebase(endPointUrl, 'POST', headers, body)
      );
    } catch (err) {
      console.log(err.message);
      switch (err.message) {
        case 'EMAIL_EXISTS':
          throw new Error(
            'This e-mail is already in use. Please use a different one.'
          );
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
        case 'USER_DISABLED':
          throw new Error('The e-mail or password is invalid');
        case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
          throw new Error(
            'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.'
          );
        default:
          throw new Error(
            'There is a problem with the connection. Please try again latter!.'
          );
      }
    }

    return response;
  };
};

export const deleteAccount = (token = null) => {
  return async (dispatch, getState) => {
    const endPointUrl = config.API_DEL_ACC.concat(config.API_KEY);
    const header = { 'Content-Type': 'application/json' };
    const body = { idToken: token ? token : getState().auth.token };
    const response = await dispatch(
      fetchFirebase(endPointUrl, 'POST', header, body)
    );

    if (!response.ok) {
      throw new Error(
        "There's something wrong with our servers. Please try again later =("
      );
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

export const authenticate = (
  authId,
  token,
  refreshToken,
  expiresIn,
  privateId,
  publicId,
  email,
  name,
  highestScore,
  image = null,
  darkTheme = false
) => {
  // SAVE USER INFO TO REDUX
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      authId: authId,
      token: token,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      privateId: privateId,
      publicId: publicId,
      email: email,
      name: name,
      highestScore: highestScore,
      image: image,
      darkTheme: darkTheme,
    });
  };
};

export const saveDataToStorage = (
  // SAVE USER INFO TO DEVICE STORAGE FOR REMEMBER-ME FUNCTION
  authId,
  token,
  refreshToken,
  expirationDate,
  privateId,
  publicId,
  email,
  name,
  highestScore,
  image = null,
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
            expiryDate: expirationDate
              ? typeof expirationDate === 'object'
                ? expirationDate.toISOString()
                : expirationDate
              : null,
            refreshToken: refreshToken,
            authId: authId,
            privateId: privateId,
            publicId: publicId,
            email: email,
            name: name,
            highestScore: highestScore,
            image: image,
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
            authId: authId,
            privateId: privateId,
            publicId: publicId,
            email: email,
            name: name,
            highestScore: highestScore,
            image: image,
            darkTheme: darkTheme,
          })
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };
};

export const fetchFirebase = (endPointUrl, method, headers, body) => {
  return async () => {
    const response = await fetch(endPointUrl, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const log = await response.json();
      throw new Error(log.error.message);
    }

    return await response.json();
  };
};
