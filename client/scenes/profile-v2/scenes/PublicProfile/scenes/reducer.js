import { combineReducers } from "redux";

import { default as allContributionsReducer } from "./AllContributions/reducer";

export const reducer = combineReducers({
  allContributions: allContributionsReducer
});
