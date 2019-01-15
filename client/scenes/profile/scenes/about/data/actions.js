import * as types from "./actionTypes";
import { getUserBasicInfo, postAccessStatus, putAnonymity } from "./service";
import history from "../../../../../history";

export function fetchUserBasicInfo(userIdParam) {
  return async (dispatch, getState) => {
    try {
      const user = getState().data.user;
      const userId = userIdParam === "profile" ? user.id : userIdParam;
      if (
        userIdParam !== "profile" &&
        Number(userIdParam) !== user.id &&
        user.roles.length &&
        user.roles[0].name !== "admin"
      )
        history.push("/unauthorized");
      else {
        const profile = await getUserBasicInfo(userId);
        dispatch({
          type: types.BASIC_INFO_FETCH_SUCCESS,
          profile
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function resetUserData() {
  return { type: types.BASIC_INFO_RESET };
}

export function changeAccessStatus({ userId, accessStatus }) {
  return async (dispatch, getState) => {
    try {
      await postAccessStatus({ userId, accessStatus });
      dispatch({
        type: types.ACCESS_STATUS_UPDATED,
        accessStatus
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function changeAnonymity() {
  return async (dispatch, getState) => {
    try {
      var user = await putAnonymity();
      dispatch({
        type: types.ANONYMITY_UPDATED
      });
    } catch (error) {
      console.log(error);
    }
  };
}
