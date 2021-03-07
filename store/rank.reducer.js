import { SET_RANKS } from './actionConstants';

const initialState = {
  rank: [],
  position: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RANKS:
      return { ...state, rank: action.rank, position: action.position };
    default:
      return state;
  }
};
