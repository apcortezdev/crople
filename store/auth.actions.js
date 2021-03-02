import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const signupOrLogin = (action, email, password, rememberMe, userName = null) => {
  return async (dispatch) => {
    let endPoint;
    if (action === 'signup')
      endPoint = config.API_SIGNUP.concat(config.API_KEY);
    else if (action === 'login')
      endPoint = config.API_SIGNIN.concat(config.API_KEY);
    else throw new Error('WRONG ACTION');

    const response = await fetch(endPoint, {
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
      else if (action === 'signup')
        errMessage =
          'There must be a problem with the connection. Please try again latter. ';
      throw new Error(errMessage);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        resData.refreshToken,
        parseInt(resData.expiresIn) * 1000,
        userName
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    if (rememberMe)
      saveDataToStorage(
        resData.idToken,
        resData.localId,
        expirationDate,
        resData.refreshToken,
        userName
      );
  };
};

export const authenticate = (userId, token, refreshToken, userName) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      refreshToken: refreshToken,
      userName: userName,
    });
  };
};

export const logout = () => {
  if (SecureStore.isAvailableAsync()) {
    SecureStore.deleteItemAsync(config.STORAGE);
  } else {
    AsyncStorage.removeItem(config.STORAGE);
  }
  return { type: LOGOUT };
};

const saveDataToStorage = async (
  token,
  userId,
  expirationDate,
  refreshToken,
  userName
) => {
  if (SecureStore.isAvailableAsync()) {
    await SecureStore.setItemAsync(
      config.STORAGE,
      JSON.stringify({
        token: token,
        expiryDate: expirationDate.toISOString(),
        refreshToken: refreshToken,
        userId: userId,
        userName: userName,
      })
    );
  } else {
    await AsyncStorage.setItem(
      config.STORAGE,
      JSON.stringify({
        token: token,
        expiryDate: expirationDate.toISOString(),
        refreshToken: refreshToken,
        userId: userId,
        userName: userName,
      })
    );
  }
};

export const refreshTokenAndAuthenticate = (
  refreshToken,
  rememberMe = false
) => {
  return async (dispatch) => {
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
      throw new Error(errMessage);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.user_id,
        resData.id_token,
        resData.refresh_token,
        'UserName'
      )
    );

    if (rememberMe) {
      // MUST SAVE DATA TO STORE
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expires_in) * 1000
      );
      saveDataToStorage(
        resData.id_token,
        resData.user_id,
        expirationDate,
        resData.refresh_token,
        'UserName'
      );
    }
  };
};
