import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {
  documentsById: null,
  documentIds: null,
  offset: 0,
  limit: 10,
  endOfResult: false
};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_DOCUMENTS_FETCH_SUCCESS:
      return {
        ...state,
        ...action
      };
    default:
      return state;
  }
}

export const getUserDocuments = state => ({
  documentsById:
    state.scenes.profile.scenes.publicProfile.scenes.documents.data
      .documentsById,
  documentIds:
    state.scenes.profile.scenes.publicProfile.scenes.documents.data
      .documentIds
});

export const getUserDocumentsOffsetAndLimit = state => ({
  limit:
    state.scenes.profile.scenes.publicProfile.scenes.documents.data.limit,
  offset:
    state.scenes.profile.scenes.publicProfile.scenes.documents.data.offset,
  endOfResult:
    state.scenes.profile.scenes.publicProfile.scenes.documents.data
      .endOfResult
});
