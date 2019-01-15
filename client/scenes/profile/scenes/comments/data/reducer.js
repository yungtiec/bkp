import { pick } from "lodash";
import * as types from "./actionTypes";

const initialState = {
  commentsById: {},
  commentIds: null,
  pageCount: 0,
  pageLimit: 10,
  pageOffset: 0,
  pageProjectFilter: [],
  pageDocumentFilter: [],
  checked: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_COMMENTS_FETCH_SUCCESS:
      return {
        ...state,
        commentsById: action.commentsById,
        commentIds: action.commentIds,
        pageCount: Math.ceil(action.commentCount / state.pageLimit)
      };
    case types.PAGE_LIMIT_UPDATED:
      return { ...state, pageLimit: action.pageLimit };
    case types.PAGE_OFFSET_UPDATED:
      return { ...state, pageOffset: action.pageOffset };
    case types.PAGE_PROJECT_FILTER_UPDATED:
      return { ...state, pageProjectFilter: action.pageProjectFilter };
    case types.PAGE_SURVEY_FILTER_UPDATED:
      return { ...state, pageDocumentFilter: action.pageDocumentFilter };
    case types.SIDEBAR_FILTER_CHECKED:
      return { ...state, checked: action.checked };
    default:
      return state;
  }
}

export const getUserComments = state => {
  const {
    commentsById,
    commentIds
  } = state.scenes.profile.scenes.comments.data;
  return {
    commentsById,
    commentIds
  };
};

export const getPageAndFilter = state =>
  pick(state.scenes.profile.scenes.comments.data, [
    "pageLimit",
    "pageOffset",
    "pageCount",
    "pageProjectFilter",
    "pageDocumentFilter",
    "checked"
  ]);
