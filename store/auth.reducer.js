import { AUTHENTICATE, LOGOUT } from './actionConstants';

const initialState = {
  userId: null,
  userToken: null,
  refreshToken: null,
  expirationToken: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        userToken: action.token,
        userId: action.userId,
        refreshToken: action.refreshToken,
        expirationToken: action.expiresIn,
      };
    case LOGOUT:
      return {
        initialState,
      };
    default:
      return state;
  }
};
