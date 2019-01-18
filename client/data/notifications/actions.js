import * as types from "./actionTypes";
import { keyBy } from "lodash";
import {
  getUserNotifications,
  putNotificationStatus,
  putAllNotificationStatus
} from "./service";

export function fetchUserNotifications() {
  return async dispatch => {
    try {
      const notifications = await getUserNotifications();
      const notificationsById = keyBy(notifications, "id");
      dispatch({
        type: types.NOTIFICATIONS_FETCH_SUCCESS,
        notificationsById
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function updateNotificationStatus(notification, status) {
  return async dispatch => {
    try {
      await putNotificationStatus(notification, status);
      dispatch({
        type: types.NOTIFICATION_UPDATED,
        notificationId: notification.id,
        status
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function updateAllNotificationStatus(status) {
  return async (dispatch, getState) => {
    try {
      const notificationIds = getState().data.notifications.notificationIds;
      await putAllNotificationStatus(notificationIds, status);
      dispatch({
        type: types.ALL_NOTIFICATIONS_READ
      });
    } catch (err) {
      console.log(err);
    }
  };
}
