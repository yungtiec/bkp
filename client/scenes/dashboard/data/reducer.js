import * as types from "./actionTypes";
import { assignIn, pick } from "lodash";

const initialState = {
  commentsById: null,
  commentIds: null,
  commentOffset: 0,
  commentLimit: 10,
  commentEndOfResult: false,
  additionalCommentsLoading: false,
  commentsLoading: true,
  documentIds: null,
  documentsById: null,
  documentOffset: 5,
  documentsLoading: true,
  additionalDocumentsLoading: false,
  allDocumentsFetched: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADDITIONAL_DOCUMENTS_REQUESTED:
      return {
        ...state,
        additionalDocumentsLoading: true
      };
    case types.DOCUMENTS_REQUESTED:
      return {
        ...state,
        documentsLoading: true
      };
    case types.DOCUMENTS_FETCH_SUCESSS:
      return {
        ...state,
        documentIds: action.loadMore
          ? (state.documentIds || []).concat(action.documentIds || [])
          : action.documentIds,
        documentsById: assignIn(action.documentsById, state.documentsById),
        additionalDocumentsLoading: false,
        documentsLoading: false,
        allDocumentsFetched: action.loadMore
      };
    case types.ADDITIONAL_COMMENTS_REQUESTED:
      return {
        ...state,
        additionalCommentsLoading: true
      };
    case types.COMMENTS_REQUESTED:
      return {
        ...state,
        commentsLoading: true
      };
    case types.COMMENTS_FETCH_SUCESSS:
      return {
        ...state,
        commentIds: action.loadMore
          ? (state.commentIds || []).concat(action.commentIds || [])
          : action.commentIds,
        commentsById: assignIn(action.commentsById, state.commentsById),
        commentOffset: action.commentOffset,
        commentEndOfResult: action.commentEndOfResult,
        additionalCommentsLoading: false,
        commentsLoading: false
      };
    default:
      return state;
  }
}

export function getDocuments(state) {
  return pick(state.scenes.dashboard.data, [
    "documentIds",
    "documentsById",
    "allDocumentsFetched",
    "documentsLoading",
    "additionalDocumentsLoading"
  ]);
}

export function getComments(state) {
  return pick(state.scenes.dashboard.data, [
    "commentsById",
    "commentIds",
    "commentOffset",
    "commentLimit",
    "commentEndOfResult",
    "additionalCommentsLoading",
    "commentsLoading"
  ]);
}
