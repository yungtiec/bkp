import "./Notifications.scss";
import React from "react";
import { NotificationItem } from "./components";

export default ({
  notificationsById,
  notificationIds,
  markAllAsRead,
  updateStatus
}) => (
  <div className="main-container">
    <div className="notification-items__container">
      {!notificationIds || !(notificationIds && notificationIds.length) ? (
        <p className="text-center mt-5">No New Notification</p>
      ) : null}
      {notificationIds && notificationIds.length ? (
        <div className="text-right">
          <button onClick={markAllAsRead} className="btn btn-outline-primary">
            Mark all as read
          </button>
        </div>
      ) : null}
      {notificationIds && notificationIds.length
        ? notificationIds.map(nid => (
            <NotificationItem
              key={`notification-item__${nid}`}
              handleClick={() => updateStatus(notificationsById[nid])}
              message={notificationsById[nid].message}
              createdAt={notificationsById[nid].createdAt}
              sender={notificationsById[nid].sender}
              status={notificationsById[nid].status}
            />
          ))
        : null}
    </div>
  </div>
);
