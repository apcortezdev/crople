import { AUTHENTICATE, LOGOUT } from './auth.actions';

const initialState = {
  userId: null,
  userToken: null,
  refreshToken: null,
  userName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        userToken: action.token,
        userId: action.userId,
        refreshToken: action.refreshToken,
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
