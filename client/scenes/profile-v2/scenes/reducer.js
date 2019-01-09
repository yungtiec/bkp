import { combineReducers } from "redux";

import { default as publicProfileReducer } from "./PublicProfile/reducer";

export const reducer = combineReducers({
  publicProfile: publicProfileReducer
});
