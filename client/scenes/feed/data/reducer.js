import * as types from "./actionTypes";

const initialState = {
  featureDocuments: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FEATURE_DOCUMENTS_FETCHED_SUCESSS:
      return {
        ...state,
        featureDocuments: action.featureDocuments
      };
    default:
      return state;
  }
}

export function getFeatureDocuments(state) {
  return state.scenes.feed.data.featureDocuments;
}
