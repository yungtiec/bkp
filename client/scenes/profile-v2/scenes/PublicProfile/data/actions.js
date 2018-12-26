import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserContributions } from "./service";

export function fetchUserContributions(userHandle) {
  return async (dispatch, getState) => {
    try {
      var results = await getUserContributions(userHandle);
      const contributions = results[0].map((c, i) => assignIn(c, { cid: i }));
      console.log(results);
      const contributionsById = keyBy(contributions, "cid");
      const contributionIds = contributions.map(i => i.cid);
      dispatch({
        type: types.USER_CONTRIBUTIONS_FETCH_SUCCESS,
        contributionsById,
        contributionIds
      });
    } catch (error) {
      console.error(error);
    }
  };
}
