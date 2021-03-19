import { ADD_POINT, SET_POINTS, SET_THEME } from './actionConstants';
import { checkStorage, authenticate, saveDataToStorage } from './auth.actions';
import { logout } from './user.actions';

export const addPoints = () => {
  return { type: ADD_POINT };
};

export const setPoints = (points) => {
  return { type: SET_POINTS, points: points };
};

export const setTheme = (theme) => {
  /// TO DO: SAVE THIS THEME STORAGE!!!!!!!!!!!!!!!!!!!
  return { type: SET_THEME, darkTheme: theme}
}

export const startAsync = () => {
  return async (dispatch) => {
    // let storage;
    // try {
    //   storage = await dispatch(checkStorage());
    // } catch (err) {
    //   storage = false;
    // }
    // if (storage) {
    //   // GETS APP INFO FROM STORAGE
    //   let expirationDate;
    //   if (storage.expiresIn) {
    //     expirationDate = new Date(storage.expiresIn);
    //   }
    //   try {
    //     dispatch(
    //       authenticate(
    //         storage.userId,
    //         storage.token,
    //         storage.refreshToken,
    //         expirationDate,
    //         storage.infoId,
    //         storage.userEmail,
    //         storage.userName,
    //         storage.highestScore,
    //         storage.userImage,
    //         storage.darkTheme
    //       )
    //     );
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // } else {
    //   // IF NO STORAGE, CREATES EMPTY ONE
    //   try {
    //     dispatch(
    //       authenticate(null, null, null, null, null, null, null, 0, null, 'off')
    //     );
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    //   try {
    //     dispatch(
    //       saveDataToStorage(
    //         null,
    //         null,
    //         null,
    //         null,
    //         null,
    //         null,
    //         null,
    //         0,
    //         null,
    //         'off'
    //       )
    //     );
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // }
  };
};
