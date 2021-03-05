import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const signupOrLogin = (
  // SIGN UP OR LOGIN IN FIREBASE AUTHENTICATION WITH EMAIL AND PASSWORD
  action,
  email,
  password,
  rememberMe,
  userName = null
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
      else if (action === 'signup')
        errMessage =
          'There must be a problem with the connection. Please try again latter. ';
      throw new Error(errMessage);
    }

    const resData = await response.json();

    if (action === 'signup') {
      // IF IS NEW USER, USER DETAILS HAVE TO BE SAVED
      try {
        await dispatch(
          saveNewUserData(resData.idToken, resData.localId, userName)
        );
      } catch (err) {
        console.log(err.message);
      }
    } else if (action === 'login') {
      try {
        const userInfo = await dispatch(
          fetchUserData(resData.idToken, resData.localId)
        );
        userName = userInfo[Object.keys(userInfo)[0]].userName;
      } catch (err) {
        userName = 'NoConnection';
        console.log(err.message);
      }
    }

    const expirationDate = new Date(
      // TURNS EXPIRATION TIME (MILLISECONDS) INTO A DATE FOR FUTURE COMPARISON
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    dispatch(
      // SAVE USER INFO TO REDUX
      authenticate(
        resData.localId,
        resData.idToken,
        resData.refreshToken,
        expirationDate,
        userName
      )
    );

    if (rememberMe) {
      // SAVE USER INFO TO DEVICE STORAGE IF REMEMBER-ME OPTION IS ON
      saveDataToStorage(
        resData.localId,
        resData.idToken,
        resData.refreshToken,
        expirationDate,
        userName
      );
    }
  };
};

export const saveNewUserData = (token, userId, userName, userImage = null) => {
  // SAVE USER DETAILS TO REALTIME DATABASE AFTER NEW SIGN UP
  return async () => {
    const endPointUrl = config.API_USERS.concat('auth='.concat(token));

    const response = await fetch(endPointUrl, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userName,
        userImage,
        highestScore: '0',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save new user');
    }
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

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  };
};

export const updateUserData = (token, userId) => {
  // UPDATE USER DETAILS IN REALTIME DATABASE
  // USERS_DPI = USERS DELETE & PATCH API URL
  // USERS_DPA = USERS DELETE & PATCH API AUTHENTICATION
};

export const authenticate = (
  userId,
  token,
  refreshToken,
  expiresIn,
  userName
) => {
  // SAVE USER INFO TO REDUX
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      token: token,
      refreshToken: refreshToken,
      expiresIn: expiresIn,
      userName: userName,
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

const saveDataToStorage = async (
  // SAVE USER INFO TO DEVICE STORAGE FOR REMEMBER-ME FUNCTION
  userId,
  token,
  refreshToken,
  expirationDate,
  userName
) => {
  if (SecureStore.isAvailableAsync()) {
    // ID SECURE CRIPTOGRAPHY AVAILABLE
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
  // EXCHANGE REFRESH TOKEN FOR NEW ID TOKEN AND SAVE NEW TOKEN TO REDUX AND DEVICE STORAGE
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
      throw new Error();
    }

    const resData = await response.json();

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
        userInfo[Object.keys(userInfo)[0]].userName
      )
    );

    if (rememberMe) {
      // IF UPDATE DATA IN DEVICE STORAGE
      saveDataToStorage(
        resData.user_id,
        resData.id_token,
        resData.refresh_token,
        expirationDate,
        userInfo[Object.keys(userInfo)[0]].userName
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
