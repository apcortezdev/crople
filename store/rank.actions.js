import config from '../config';
import { SET_RANKS } from './actionConstants';

export const fetchRanks = () => {
  // FETCH USER DETAILS FOR RANKING
  return async (dispatch, getState) => {
    const body = new URLSearchParams();
    body.append('orderBy', '"highestScore"');
    body.append('limitToLast', '100');

    const endPointUrl = config.API_USERS_PUBLIC.concat(body.toString());
    const response = await fetch(endPointUrl);

    if (!response.ok) {
      return [];
    }

    const rank = await response.json();

    if (!rank) {
      return [];
    }

    let position = 0;

    // SPREADS JSON OBJS INTO ARRAY
    const rankArray = Object.keys(rank).map((key) => {
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
      return player[Object.keys(player)[0]].authId === getState().auth.authId;
    });

    dispatch({
      type: SET_RANKS,
      rank: sortedRank,
      position: ++position,
    });
  };
};
