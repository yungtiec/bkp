import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserContributions } from "./service";
import { getUserContributionsOffsetAndLimit } from "./reducer";

export function fetchUserContributions(userHandle, direction) {
  return async (dispatch, getState) => {
    try {
      var { offset, limit } = getUserContributionsOffsetAndLimit(getState());
      if (direction) {
        offset = direction > 0 ? offset + limit : offset - limit;
      }
      var results = await getUserContributions({ userHandle, offset, limit });
      const contributions = results[0].map((c, i) => assignIn(c, { cid: i }));
      const contributionsById = keyBy(contributions, "cid");
      const contributionIds = contributions.map(i => i.cid);
      dispatch({
        type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
        contributionsById,
        contributionIds,
        offset
      });
    } catch (error) {
      console.error(error);
    }
  };
}
