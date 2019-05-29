import * as types from "./actionTypes";
import {assignIn, uniqBy} from "lodash";

const initialState = {
  featuredDocuments: null,
  featuredDocumentOffset: 0,
  featuredDocumentLimit: 10,
  featuredDocumentCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FEATURED_DOCUMENTS_FETCHED_SUCESSS:
      const featuredDocuments = action.featuredDocuments;
      return {
        ...state,
        featuredDocuments,
        featuredDocumentOffset: action.featuredDocumentOffset,
        featuredDocumentCount: action.count
      };
    default:
      return state;
  }
}

export function getOwnFeaturedDocuments(state) {
  return {
    featuredDocuments:
      state.scenes.myDocuments.scenes.featuredDocuments.data
        .featuredDocuments
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.myDocuments.scenes.featuredDocuments.data
      .featuredDocumentOffset <
    state.scenes.myDocuments.scenes.featuredDocuments.data
      .featuredDocumentCount
  );
}
