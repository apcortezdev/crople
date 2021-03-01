export const ADD_POINTS = 'ADD_POINTS';
export const SET_POINTS = 'SET_POINTS';
export const REPORT_ERROR = 'REPORT_ERROR';

export const addPoints = (points) => {
  return { type: ADD_POINTS, points: points };
};

export const setPoints = (points) => {
  return { type: SET_POINTS, points: points };
};

export const reportError = (err) => {
  return { type: REPORT_ERROR, error: err };
};
