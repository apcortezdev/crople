import config from '../config';
import { SET_RANKS } from './actionConstants';
import { refreshAndSaveToken } from './auth.actions';

export const fetchRanks = () => {
  // FETCH USER DETAILS FOR RANKING
  return async (dispatch, getState) => {
    // REFRESH TOKEN IF NEEDED
    if (new Date(getState().auth.expirationToken) <= new Date()) {
      await dispatch(refreshAndSaveToken(getState().auth.refreshToken));
    }

    const token = getState().auth.userToken;

    const body = new URLSearchParams();
    body.append('orderBy', '"highestScore"');
    body.append('limitToLast', '100');
    body.append('auth', token);
    const endPointUrl = config.API_USERS.concat(body.toString());

    const response = await fetch(endPointUrl);

    if (!response.ok) {
      return [];
    }

    const rank = await response.json();

    let user = null;
    let position = 0;

    // SPREADS JSON OBJS INTO ARRAY
    const rankArray = Object.keys(rank).map((key) => {
      if (key === getState().game.infoId) {
        user = { [key]: rank[key] };
      }
      return { [key]: rank[key] };
    });

    const sortedRank = rankArray.sort((a, b) => {
      if (
        b[Object.keys(b)[0]].highestScore < a[Object.keys(a)[0]].highestScore
      ) {
        return -1;
      }
      if (
        b[Object.keys(b)[0]].highestScore > a[Object.keys(a)[0]].highestScore
      ) {
        return 1;
      }
      return 0;
    });

    position = sortedRank.findIndex((player) => {
      return Object.keys(player)[0] === getState().game.infoId;
    });

    dispatch({
      type: SET_RANKS,
      rank: sortedRank,
      position: ++position,
    });
  };
};
