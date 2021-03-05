import { AUTHENTICATE, LOGOUT } from './auth.actions';

const initialState = {
  userId: null,
  userToken: null,
  refreshToken: null,
  expirationToken: null,
  userName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        userToken: action.token,
        userId: action.userId,
        refreshToken: action.refreshToken,
        expirationToken: action.expiresIn,
        userName: action.userName,
      };
    case LOGOUT:
      return {
        initialState,
      };
    default:
      return state;
  }
};
