import {
    SET_NEW_RECORD,
    AUTHENTICATE,
    REFRESH_IMAGE,
  } from './actionConstants';
  
  const initialState = {
    infoId: null,
    userEmail: null,
    userName: null,
    highestScore: 0,
    userImage: null,
  };

  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_NEW_RECORD:
        return { ...state, highestScore: action.points };
      case AUTHENTICATE:
        return {
          ...state,
          infoId: action.infoId,
          userEmail: action.userEmail,
          userName: action.userName,
          highestScore: action.highestScore,
          userImage: action.userImage,
        };
      case REFRESH_IMAGE:
        return {
          ...state,
          infoId: state.infoId,
          userEmail: state.userEmail,
          userName: state.userName,
          points: state.points,
          highestScore: state.highestScore,
          userImage: initialState.userImage,
        };
      default:
        return state;
    }
  };
  