import * as types from "./actionTypes";
import { getUserProfile, getUserContributions } from "./service";

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


