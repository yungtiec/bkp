import * as types from "./actionTypes";
import {assignIn, uniqBy} from "lodash";

const initialState = {
  draftDocuments: null,
  draftOffset: 0,
  draftLimit: 10,
  draftCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.DRAFTS_FETCHED_SUCESSS:
      const draftDocuments = uniqBy((state.draftDocuments || []).concat(action.draftDocuments), (doc) => {
        if(doc) return doc.id
        return doc;
      });
      return {
        ...state,
        draftDocuments,
        draftOffset: action.draftOffset,
        draftCount: action.count
      };
    default:
      return state;
  }
}

export function getOwnDrafts(state) {
  return {
    draftDocuments: state.scenes.myDocuments.scenes.drafts.data.draftDocuments
  };
}

export function canLoadMore(state) {
  return (
    state.scenes.myDocuments.scenes.drafts.data.draftOffset <
    state.scenes.myDocuments.scenes.drafts.data.draftCount
  );
}
