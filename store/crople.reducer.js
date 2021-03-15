import {
  ADD_POINT,
  SET_NEW_RECORD,
  SET_POINTS,
  AUTHENTICATE,
  REFRESH_IMAGE,
} from './actionConstants';

const initialState = {
  infoId: null,
  userEmail: null,
  userName: null,
  points: 0,
  highestScore: 0,
  userImage: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POINT:
      const newScore = state.points + 1;
      return { ...state, points: newScore };
    case SET_NEW_RECORD:
      return { ...state, highestScore: state.points };
    case AUTHENTICATE:
      return {
        ...state,
        infoId: action.infoId,
        userEmail: action.userEmail,
        userName: action.userName,
        points: 0,
        highestScore: action.highestScore,
        userImage: action.userImage,
      };
    case REFRESH_IMAGE:
      // The image path never actually changes, so for react native to update the components
      // we set the path to null right before saving the new pic.. which will have the same
      // path as the old pic... This is jerry-rigged.... I know
      return {
        ...state,
        infoId: state.infoId,
        userEmail: state.userEmail,
        userName: state.userName,
        points: state.points,
        highestScore: state.highestScore,
        userImage: null,
      };
    case SET_POINTS:
      return { ...state, points: action.points };
    default:
      return state;
  }
};
