import { ADD_POINT, AUTHENTICATE, SET_POINTS } from './actionConstants';

const initialState = {
  points: 0,
  darkTheme: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POINT:
      const newScore = state.points + 1;
      return { ...state, points: newScore };
    case SET_POINTS:
      return { ...state, points: action.points };
    case AUTHENTICATE:
      return {
        ...state,
        darkTheme: action.darkTheme,
      };
    default:
      return state;
  }
};
