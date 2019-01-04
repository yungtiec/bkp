import * as types from "./actionTypes";
import { getUserProfile, putUserProfile } from "./service";

export function fetchUserProfile(userHandle) {
  return async (dispatch, getState) => {
    try {
      const profile = await getUserProfile(userHandle);
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
      dispatch({
        type: types.USER_PROFILE_UPDATED,
        profile
      });
    } catch (error) {
      console.error(error);
    }
  };
}
