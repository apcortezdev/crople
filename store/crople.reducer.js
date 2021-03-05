import {
  ADD_POINT,
  SET_NEW_RECORD,
  SET_POINTS,
  AUTHENTICATE,
} from './actionConstants';

const initialState = {
  infoId: null,
  userName: null,
  points: 0,
  highestScore: 0,
  position: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POINT:
      const newScore = state.points + 1;
      return { ...state, points: newScore };
    case SET_NEW_RECORD:
      return { ...state, highestScore: state.points };
    case AUTHENTICATE:
      return { ...state, userName: action.userName, infoId: action.infoId, highestScore: action.highestScore };
    case SET_POINTS:
      return { ...state, points: action.points };
    default:
      return state;
  }
};
