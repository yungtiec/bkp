import { combineReducers } from "redux";

import { default as projectReducer } from "./project/reducer";
import { default as profileReducer } from "./profile/reducer";
import { default as profileV2Reducer } from "./profile-v2/reducer";
import { default as adminReducer } from "./admin/reducer";
import { default as uploadReducer } from "./upload/reducer";
import { default as activityBoardReducer } from "./activity-board/reducer";
import { default as dashboardReducer } from "./dashboard/reducer";
import { default as documentReducer } from "./document/reducer";
import { default as wizardReducer } from "./wizard/reducer";
import { default as myDocumentsReducer } from "./my-documents/reducer";

export default combineReducers({
  project: projectReducer,
  profile: profileReducer,
  profileV2: profileV2Reducer,
  admin: adminReducer,
  upload: uploadReducer,
  activityBoard: activityBoardReducer,
  dashboard: dashboardReducer,
  document: documentReducer,
  wizard: wizardReducer,
  myDocuments: myDocumentsReducer
});
