import { ADD_POINTS, SET_POINTS } from './crople.actions';

const initialState = {
  points: 0,
  maxPoints: 0,
  position: 155,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POINTS:
      const newScore = state.points + action.points;
      if (state.maxPoints < newScore)
        return { ...state, points: newScore, maxPoints: newScore };
      return { ...state, points: newScore };
    case SET_POINTS:
      return { ...state, points: action.points };
    default:
      return state;
  }
};
