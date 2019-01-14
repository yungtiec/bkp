import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {
  commentsById: null,
  commentIds: null,
  offset: 0,
  limit: 10,
  endOfResult: false
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_COMMENTS_FETCH_SUCCESS:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}

export const getUserComments = state => ({
  commentsById:
    state.scenes.profile.scenes.publicProfile.scenes.comments.data
      .commentsById,
  commentIds:
    state.scenes.profile.scenes.publicProfile.scenes.comments.data
      .commentIds
});

export const getUserCommentsOffsetAndLimit = state => ({
  limit:
    state.scenes.profile.scenes.publicProfile.scenes.comments.data.limit,
  offset:
    state.scenes.profile.scenes.publicProfile.scenes.comments.data.offset,
  endOfResult:
    state.scenes.profile.scenes.publicProfile.scenes.comments.data
      .endOfResult
});
