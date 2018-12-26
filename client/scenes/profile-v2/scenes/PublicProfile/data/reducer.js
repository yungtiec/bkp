import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {
  contributionsById: null,
  contributionIds: null
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_CONTRIBUTIONS_FETCH_SUCCESS:
      return {
        ...state,
        contributionsById: action.contributionsById,
        contributionIds: action.contributionIds
      };
    default:
      return state;
  }
}

export const getUserContributions = state => ({
  contributionsById:
    state.scenes.profileV2.scenes.publicProfile.data.contributionsById,
  contributionIds:
    state.scenes.profileV2.scenes.publicProfile.data.contributionIds
});
