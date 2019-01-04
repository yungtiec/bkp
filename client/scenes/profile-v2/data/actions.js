import * as types from "./actionTypes";
import { getUserProfile, putUserProfile } from "./service";
import { groupBy, assignIn } from "lodash";

export function fetchUserProfile(userHandle) {
  return async (dispatch, getState) => {
    try {
      var profile = await getUserProfile(userHandle);
      var { role, location } = groupBy(profile.tags, "type");
      profile = assignIn(profile, { careerRole: role, location });
      delete profile.tags;
      dispatch({
        type: types.USER_PROFILE_FETCH_SUCCESS,
        profile
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateProfile(profile) {
  return async (dispatch, getState) => {
    try {
      profile = await putUserProfile(profile);
      var { role, location } = groupBy(profile.tags, "type");
      profile = assignIn(profile, { careerRole: role, location });
      delete profile.tags;
      dispatch({
        type: types.USER_PROFILE_UPDATED,
        profile
      });
    } catch (error) {
      console.error(error);
    }
  };
}
