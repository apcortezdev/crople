import { ADD_POINT, SET_POINTS } from './actionConstants';

export const addPoints = () => {
  return { type: ADD_POINT };
};

export const setPoints = (points) => {
  return { type: SET_POINTS, points: points };
};