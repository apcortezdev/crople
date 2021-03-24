import { AUTHENTICATE, LOGOUT } from './actionConstants';

const initialState = {
  authId: null,
  token: null,
  refreshToken: null,
  expirationToken: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        authId: action.authId,
        refreshToken: action.refreshToken,
        expirationToken: action.expiresIn,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
