import {
  ADD_POINT,
  AUTHENTICATE,
  LOGOUT,
  SET_POINTS,
  SET_THEME,
} from './actionConstants';

const initialState = {
  points: 0,
  darkTheme: 'auto',
};

export default (state = initialState, action) => {
  let newScore;
  switch (action.type) {
    case ADD_POINT:
      newScore = state.points + 1;
      return { ...state, points: newScore };
    case SET_POINTS:
      return { ...state, points: action.points };
    case SET_THEME:
    case AUTHENTICATE:
      return {
        ...state,
        darkTheme: action.darkTheme,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
