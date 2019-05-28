import * as types from "./actionTypes";
import { values, orderBy, cloneDeep, keys, assignIn, uniqBy } from "lodash";

const initialState = {
  documents: null,
  offset: 0,
  limit: 10,
  count: null,
  fetchError: false
};

const generateUniqueDocs = (originalDocs, newDocs) => {

};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.DOCUMENT_LISTING_FETCH_SUCCESS:
      const docs = action.documents;
      console.log({docs});
      return {
        ...state,
        documents: docs,
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
