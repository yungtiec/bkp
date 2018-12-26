import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {
  contributionsById: null,
  contributionIds: null,
  offset: 0,
  limit: 10
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_CONTRIBUTIONS_FETCH_SUCCESS:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}

export const getUserContributions = state => ({
  contributionsById:
    state.scenes.profileV2.scenes.publicProfile.scenes.allContributions.data
      .contributionsById,
  contributionIds:
    state.scenes.profileV2.scenes.publicProfile.scenes.allContributions.data
      .contributionIds
});

export const getUserContributionsOffsetAndLimit = state => ({
  limit:
    state.scenes.profileV2.scenes.publicProfile.scenes.allContributions.data
      .limit,
  offset:
    state.scenes.profileV2.scenes.publicProfile.scenes.allContributions.data
      .offset
});
