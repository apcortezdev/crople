import {
  SET_NEW_RECORD,
  AUTHENTICATE,
  REFRESH_IMAGE,
  LOGOUT,
} from './actionConstants';

const initialState = {
  privateId: null,
  publicId: null,
  email: null,
  name: null,
  highestScore: 0,
  image: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_RECORD:
      return { ...state, highestScore: action.points };
    case AUTHENTICATE:
      return {
        ...state,
        privateId: action.privateId,
        publicId: action.publicId,
        email: action.email,
        name: action.name,
        highestScore: action.highestScore,
        image: action.image,
      };
    case LOGOUT:
      return initialState;
    case REFRESH_IMAGE:
      return {
        ...state,
        privateId: state.privateId,
        publicId: state.publicId,
        email: state.email,
        name: state.name,
        points: state.points,
        highestScore: state.highestScore,
        image: initialState.image,
      };
    default:
      return state;
  }
};
