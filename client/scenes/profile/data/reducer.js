import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_PROFILE_FETCH_SUCCESS:
    case types.USER_PROFILE_UPDATED:
    case types.USER_ACCOUNT_UPDATED:
      return {
        ...state,
        profile: assignIn(cloneDeep(state.profile), action.profile)
      };
    default:
      return state;
  }
}

export const getUserProfile = state => state.scenes.profile.data.profile;

export const getUserContributionStats = state =>
  pick(state.scenes.profile.data.profile, [
    "num_documents",
    "num_comments",
    "num_votes"
  ]);
