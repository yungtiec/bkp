import { combineReducers } from "redux";

import { default as draftsReducer } from "./drafts/reducer";
import { default as publishedDocumentsReducer } from "./publishedDocuments/reducer";
import { default as featuredDocumentsReducer } from "./featuredDocuments/reducer";

export const reducer = combineReducers({
  drafts: draftsReducer,
  publishedDocuments: publishedDocumentsReducer,
  featuredDocuments: featuredDocumentsReducer
});
