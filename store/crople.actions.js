import { Alert } from 'react-native';
import config from '../config';
import { ADD_POINT, SET_NEW_RECORD, SET_POINTS } from './actionConstants';
import {
  refreshAndSaveToken,
  checkStorage,
  saveDataToStorage,
} from './auth.actions';

export const addPoints = () => {
  return { type: ADD_POINT };
};

export const setPoints = (points) => {
  return { type: SET_POINTS, points: points };
};

export const checkNewRecord = () => {
  return async (dispatch, getState) => {
    const points = getState().game.points;
    const highestScore = getState().game.highestScore;
    if (points > highestScore) {
      // SAVE RECORD TO RESUX
      Alert.alert('Wow', 'New Record!', [{ text: 'Ok' }]);

      dispatch(setNewRecord(points));

      // REFRESH TOKEN IF NEEDED
      if (new Date(getState().auth.expirationToken) <= new Date()) {
        await dispatch(refreshAndSaveToken(getState().auth.refreshToken));
      }

      // SAVE RECORD TO DB
      const endPointUrl = config.API_USERS_DPI.concat(
        getState().game.infoId.concat(
          config.API_USERS_DPA.concat(getState().auth.userToken)
        )
      );
      const response = await fetch(endPointUrl, {
        method: 'PATCH',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          highestScore: points,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save new user');
      }
      return true;
    } else {
      return false;
    }
  };
};

export const setNewRecord = (newRecord) => {
  return async (dispatch) => {
    const storage = await dispatch(checkStorage());

    if (storage) {
      dispatch(
        saveDataToStorage(
          storage.userId,
          storage.token,
          storage.refreshToken,
          storage.expiryDate,
          storage.infoId,
          storage.userEmail,
          storage.userName,
          newRecord
        )
      );
    }

    dispatch({ type: SET_NEW_RECORD });
  };
};
