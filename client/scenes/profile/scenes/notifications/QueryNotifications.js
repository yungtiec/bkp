import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import history from "../../../../history";

// actions - notifications
import {
  fetchUserNotifications,
  getUserNotifications,
  updateNotificationStatus,
  updateAllNotificationStatus
} from "../../../../data/reducer";

const LoadableQueryNotifications = Loadable({
  loader: () => import("./Notifications"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let UserNotifications = loaded.default;
    return <UserNotifications {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    return <LoadableQueryNotifications {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { notificationsById, notificationIds } = getUserNotifications(state);
  return {
    notificationsById,
    notificationIds,
    userId: ownProps.match.path.split("/")[2]
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {
    fetch: () => dispatch(fetchUserNotifications()),
    markAllAsRead: () => dispatch(updateAllNotificationStatus("read")),
    updateStatus: notification => {
      dispatch(updateNotificationStatus(notification, "read"));
      if (notification.uri)
        history.push(notification.uri.replace(window.origin, ""));
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(MyComponent));
