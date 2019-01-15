import * as types from "./actionTypes";
import { putUserPassword } from "./service";

export function updateUserPassword(myUserId, currentPassword, newPassword) {
  return async (dispatch, getState) => {
    try {
      const res = await putUserPassword(myUserId, currentPassword, newPassword);
      dispatch({
        type: types.PASSWORD_UPDATE_SUCCESS
      });
      return res;
    } catch (error) {
      dispatch({
        type: types.PASSWORD_UPDATE_ERROR
      });
      Promise.reject(new Error('Unable to update password. Please ensure current password is correct.'));
    }
  };
}
