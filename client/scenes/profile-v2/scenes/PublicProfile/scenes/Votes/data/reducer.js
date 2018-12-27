import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {
  votesById: null,
  voteIds: null,
  offset: 0,
  limit: 10,
  endOfResult: false
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_VOTES_FETCH_SUCCESS:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}

export const getUserVotes = state => ({
  votesById:
    state.scenes.profileV2.scenes.publicProfile.scenes.votes.data.votesById,
  voteIds: state.scenes.profileV2.scenes.publicProfile.scenes.votes.data.voteIds
});

export const getUserVotesOffsetAndLimit = state => ({
  limit: state.scenes.profileV2.scenes.publicProfile.scenes.votes.data.limit,
  offset: state.scenes.profileV2.scenes.publicProfile.scenes.votes.data.offset,
  endOfResult:
    state.scenes.profileV2.scenes.publicProfile.scenes.votes.data.endOfResult
});
