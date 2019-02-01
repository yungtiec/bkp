import * as types from "./actionTypes";
import {assignIn, uniqBy} from "lodash";

const initialState = {
  publishedDocuments: null,
  publishedDocumentOffset: 0,
  publishedDocumentLimit: 10,
  publishedDocumentCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.PUBLISHED_DOCUMENTS_FETCHED_SUCESSS:
      const publishedDocuments = action.publishedDocuments;
      console.log(publishedDocuments)
      return {
        ...state,
        publishedDocuments,
        publishedDocumentOffset: action.publishedDocumentOffset,
        publishedDocumentCount: action.count
      };
    default:
      return state;
  }
}

export function getOwnPublishedDocuments(state) {
  return {
    publishedDocuments:
      state.scenes.myDocuments.scenes.publishedDocuments.data
        .publishedDocuments
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.myDocuments.scenes.publishedDocuments.data
      .publishedDocumentOffset <
    state.scenes.myDocuments.scenes.publishedDocuments.data
      .publishedDocumentCount
  );
}
