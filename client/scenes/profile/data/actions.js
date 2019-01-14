import * as types from "./actionTypes";
import {
  getUserProfile,
  putUserProfile,
  putUserAccount,
  putUserPassword
} from "./service";
import { groupBy, assignIn, keys } from "lodash";
import { notify } from "reapop";
import history from "../../../history";

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
      var userHandle = getState().scenes.profile.data.profile.user_handle;
      profile = await putUserProfile(
        assignIn(profile, { user_handle: userHandle })
      );
      dispatch({
        type: types.USER_PROFILE_UPDATED,
        profile
      });
      dispatch(
        notify({
          title: "Profile updated",
          message: "",
          status: "success",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateAccount(account) {
  return async (dispatch, getState) => {
    try {
      var profile = getState().scenes.profile.data.profile;
      var accountFormIsPristine = keys(account).reduce(
        (bool, key) => account[key] === profile[key],
        true
      );
      if (accountFormIsPristine) return;
      var updatedProfile = await putUserAccount(
        assignIn(account, { current_user_handle: profile.user_handle })
      );
      if (profile.user_handle !== account.user_handle)
        history.push(`/profile/@${account.user_handle}/settings/account`);
      dispatch({
        type: types.USER_ACCOUNT_UPDATED,
        profile: updatedProfile
      });
      dispatch(
        notify({
          title: "Account updated",
          message: "",
          status: "success",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateUserPassword(passwordObject) {
  return async (dispatch, getState) => {
    try {
      const res = await putUserPassword(passwordObject);
      dispatch({
        type: types.PASSWORD_UPDATE_SUCCESS
      });
      dispatch(
        notify({
          title: "Password updated",
          message: "",
          status: "success",
          dismissible: true,
          dismissAfter: 3000
        })
      );
      return res;
    } catch (error) {
      dispatch({
        type: types.PASSWORD_UPDATE_ERROR
      });
      dispatch(
        notify({
          title:
            "Unable to update password. Please ensure current password is correct.",
          message: "",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
    }
  };
}
