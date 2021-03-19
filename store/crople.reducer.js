import { ADD_POINT, AUTHENTICATE, SET_POINTS, SET_THEME } from './actionConstants';

const initialState = {
  points: 0,
  darkTheme: 'on',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POINT:
      const newScore = state.points + 1;
      return { ...state, points: newScore };
    case SET_POINTS:
      return { ...state, points: action.points };
    case AUTHENTICATE:
    case SET_THEME:
      return {
        ...state,
        darkTheme: action.darkTheme,
      };
    default:
      return state;
  }
};
