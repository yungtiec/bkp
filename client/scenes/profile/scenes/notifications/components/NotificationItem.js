import "./NotificationItem.scss";
import React from "react";
import Avatar from "react-avatar";
import moment from "moment";

export default ({ handleClick, message, createdAt, sender, status }) => (
  <div
    className={`d-flex notification-item notification-item--${status}`}
    onClick={handleClick}
  >
    {sender ? (
      <div className="notification-item__user">
        <Avatar
          name={sender.displayName}
          color={"#999999"}
          size={50}
        />
      </div>
    ) : null}
    <div className="d-flex flex-column notification-item__body">
      <span className="notification-item__message">{message}</span>
      <span className="notification-item__timestamp">
        {moment(createdAt).fromNow()}
      </span>
    </div>
  </div>
);
