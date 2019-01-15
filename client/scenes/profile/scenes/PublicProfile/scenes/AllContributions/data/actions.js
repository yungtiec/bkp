import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserContributions } from "./service";
import { getUserContributionsOffsetAndLimit } from "./reducer";
import { notify } from "reapop";

export function fetchUserContributions(userHandle, direction) {
  return async (dispatch, getState) => {
    try {
      var { offset, limit } = getUserContributionsOffsetAndLimit(getState());
      if (direction) {
        offset = direction > 0 ? offset + limit : offset - limit;
      } else {
        offset = 0;
      }
      var results = await getUserContributions({ userHandle, offset, limit });
      const contributions = results[0].map((c, i) => assignIn(c, { cid: i }));
      const contributionsById = keyBy(contributions, "cid");
      const contributionIds = contributions.map(i => i.cid);
      if (contributionIds.length)
        dispatch({
          type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
          contributionsById,
          contributionIds,
          offset,
          endOfResult: contributionIds.length < limit
        });
      else if (!contributionIds.length && !direction) {
        // empty profile page where user has no contribution
        dispatch({
          type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
          contributionsById: {},
          contributionIds: [],
          endOfResult: true
        });
      } else {
        dispatch({
          type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
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
