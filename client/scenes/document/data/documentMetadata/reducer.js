import * as types from "./actionTypes";
import { maxBy, cloneDeep } from "lodash";
import moment from "moment";

const initialState = {};

const addVotesToDocument = (action, state) => {
  var newState = cloneDeep(state);
  newState.downvotesFrom = action.downvotesFrom;
  newState.upvotesFrom = action.upvotesFrom;
  return newState;
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.DOCUMENT_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        ...action.documentMetadata
      };
    case types.DOCUMENT_METADATA_RESET:
      return initialState;
    case types.DOCUMENT_CONTENT_HTML_UPDATE_SUCCESS:
      return {
        ...state,
        ...action.documentMetadata
      };
    case types.SURVEY_VOTED:
      return addVotesToDocument(action, state);
    default:
      return state;
  }
}

export function getDocumentMetadata(state) {
  return state.scenes.document.data.documentMetadata;
}

export function getDocumentLatestVersion(state) {
  if (!state.scenes.document.data.documentMetadata.id) return "";
  return maxBy(
    state.scenes.document.data.documentMetadata.versions,
    "hierarchyLevel"
  );
}

export function isClosedForComment(state) {
  if (!state.scenes.document.data.documentMetadata.id) return "";
  return (
    Number(state.scenes.document.data.documentMetadata.comment_until_unix) -
      Number(moment().format("x")) <=
    0
  );
}
