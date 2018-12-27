import { combineReducers } from "redux";

import { default as allContributionsReducer } from "./AllContributions/reducer";
import { default as documentsReducer } from "./Documents/reducer";
import { default as commentsReducer } from "./Comments/reducer";
import { default as votesReducer } from "./Votes/reducer";

export const reducer = combineReducers({
  allContributions: allContributionsReducer,
  documents: documentsReducer,
  comments: commentsReducer,
  votes: votesReducer
});
