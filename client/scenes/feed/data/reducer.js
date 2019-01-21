import * as types from "./actionTypes";
import { assignIn, pick } from "lodash";

const initialState = {
  documentIds: null,
  featureDocumentIds: null,
  documentsById: null,
  offset: 0,
  limit: 10,
  endOfResult: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FEATURE_DOCUMENTS_FETCHED_SUCESSS:
      return {
        ...state,
        featureDocumentIds: action.featureDocumentIds,
        documentsById: assignIn(action.documentsById, state.documentsById)
      };
    case types.DOCUMENTS_FETCHED_SUCESSS:
      return {
        ...state,
        documentIds: (state.documentIds || []).concat(action.documentIds || []),
        documentsById: assignIn(action.documentsById, state.documentsById),
        offset: action.offset,
        endOfResult: action.endOfResult
      };
    default:
      return state;
  }
}

export function getFeatureDocuments(state) {
  return pick(state.scenes.feed.data, ["documentsById", "featureDocumentIds"]);
}

export function getFilteredDocuments(state) {
  return pick(state.scenes.feed.data, ["documentIds", "documentsById"]);
}

export function getFilteredDocumentsOffsetAndLimit(state) {
  return pick(state.scenes.feed.data, ["offset", "limit", "endOfResult"]);
}
