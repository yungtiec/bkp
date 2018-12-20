import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys, assignIn } from "lodash";

const initialState = {
  documentsById: null,
  documentIds: null,
  documents: null,
  offset: 0,
  limit: 10,
  count: null,
  fetchError: false
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.DOCUMENT_LISTING_FETCH_SUCCESS:
      return {
        ...state,
        //documentsById: assignIn(action.documentsById, state.documentsById || {}),
        //documentIds: (state.documentIds || []).concat(action.documentIds),
        documents: (state.documents || []).concat(action.documents),
        offset: action.offset,
        count: action.count
      };
    case types.DOCUMENT_LISTING_FETCH_ERROR:
      return {
        fetchError: true,
        ...state
      };
    default:
      return state;
  }
}

export const getDocumentListing = state => state.data.documents;
