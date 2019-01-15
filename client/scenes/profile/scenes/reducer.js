import { combineReducers } from "redux";

import { default as aboutReducer } from "./about/reducer";
import { default as commentsReducer } from "./comments/reducer";
import { default as passwordReducer } from "./password/reducer";

export const reducer = combineReducers({
  about: aboutReducer,
  comments: commentsReducer,
  password: passwordReducer
});
