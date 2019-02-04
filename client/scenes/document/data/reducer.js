import { combineReducers } from "redux";

import { default as documentMetadataReducer } from "./documentMetadata/reducer";
import { default as commentsReducer } from "./comments/reducer";
import { default as tagsReducer } from "./tags/reducer";
import { default as uploadReducer } from "./upload/reducer";
import { default as ckEditor } from "./ckEditor/reducer";

export const reducer = combineReducers({
  documentMetadata: documentMetadataReducer,
  comments: commentsReducer,
  tags: tagsReducer,
  upload: uploadReducer,
  ckEditor: ckEditor
});
