import {
  ADD_POINT,
  SET_NEW_RECORD,
  SET_POINTS,
  AUTHENTICATE,
} from './actionConstants';

const initialState = {
  infoId: null,
  userEmail: null,
  userName: null,
  points: 0, 
  highestScore: 0,
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
      };
    case SET_POINTS:
      return { ...state, points: action.points };
    default:
      return state;
  }
};
