import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserVotes } from "./service";
import { getUserVotesOffsetAndLimit } from "./reducer";
import { notify } from "reapop";

export function fetchUserVotes(userHandle, direction) {
  return async (dispatch, getState) => {
    try {
      var { offset, limit } = getUserVotesOffsetAndLimit(getState());
      if (direction) {
        offset = direction > 0 ? offset + limit : offset - limit;
      } else {
        offset = 0;
      }
      var results = await getUserVotes({ userHandle, offset, limit });
      const votes = results[0].map((c, i) => assignIn(c, { cid: i }));
      const votesById = keyBy(votes, "cid");
      const voteIds = votes.map(i => i.cid);
      if (voteIds.length)
        dispatch({
          type: types.USER_VOTES_FETCH_SUCCESS,
          votesById,
          voteIds,
          offset,
          endOfResult: voteIds.length < limit
        });
      else if (!voteIds.length && !direction) {
        // empty profile page where user has no vote
        dispatch({
          type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
          votesById: null,
          voteIds: null,
          endOfResult: true
        });
      } else {
        dispatch({
          type: types.USER_VOTES_FETCH_SUCCESS,
          endOfResult: true
        });
        if (direction)
          dispatch(
            notify({
              title: "You've reached the end of results",
              message: "",
              status: "info",
              dismissible: true,
              dismissAfter: 3000
            })
          );
      }
    } catch (error) {
      console.error(error);
    }
  };
}
