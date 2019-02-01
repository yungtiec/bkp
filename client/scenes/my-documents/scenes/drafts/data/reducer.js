import * as types from "./actionTypes";
import {assignIn, uniqBy} from "lodash";

const initialState = {
  draftDocuments: null,
  draftLimit: 10,
  draftCount: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.DRAFTS_FETCHED_SUCESSS:
      const draftDocuments = action.draftDocuments;
      return {
        ...state,
        draftDocuments,
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
