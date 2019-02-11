import "./Navbar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  logout,
  currentUserIsAdmin,
  getUserNotificationCount,
  fetchUserNotifications,
  getUserNotifications,
  updateNotificationStatus,
  updateAllNotificationStatus
} from "../data/reducer";
import { AuthWidget, NotificationFlyout } from "./index";
import asyncPoll from "react-async-poll";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../policies.js";
import history from "../history";

const onPollInterval = (props, dispatch) => {
  if (!props.isLoggedIn) return;
  return props.fetchUserNotifications();
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchUserNotifications();
  }

  render() {
    const {
      isAdmin,
      isLoggedIn,
      width,
      user,
      numNotifications,
      notificationsById,
      notificationIds,
      markAllAsRead,
      updateStatus
    } = this.props;

    return (
      <div className="header">
        <nav className="navbar navbar-expand-md no-gutters navbar--logo app-container">
          <div className="box--left">
            <Link className="logo-header my-0 ml-0" to="/feed">
              <img
                width="100px"
                height="auto"
                className="logo__large"
                src="/assets/the-brooklyn-project-logo.png"
              />
            </Link>
            {width > 600 && isAdmin ? (
              <Link to="/admin" className="navbar__nav-item">
                admin
              </Link>
            ) : (
              ""
            )}
            {width > 600 ? (
              <Link to="/feed" className="navbar__nav-item">
                home
              </Link>
            ) : (
              ""
            )}
            {width > 600 ? (
              <a
                href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
                target="_blank"
                className="navbar__nav-item"
              >
                join telegram
              </a>
            ) : (
              ""
            )}
            {width > 970 ? (
              <PunditContainer policies={policies} user={user}>
                <PunditTypeSet type="Disclosure">
                  <VisibleIf action="Create" model={{}}>
                    <Link to="/upload" className="navbar__nav-item">
                      create
                    </Link>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
            ) : (
              ""
            )}
            {width > 970 ? (
              <PunditContainer policies={policies} user={user}>
                <PunditTypeSet type="Disclosure">
                  <VisibleIf action="Create" model={{}}>
                    <Link to="/dashboard" className="navbar__nav-item">
                      recent comments
                    </Link>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
            ) : (
              ""
            )}
            {width > 970 ? (
              <PunditContainer policies={policies} user={user}>
                <PunditTypeSet type="Disclosure">
                  <VisibleIf action="Create" model={{}}>
                    <Link to="/me/documents" className="navbar__nav-item">
                      my documents
                    </Link>
                  </VisibleIf>
                </PunditTypeSet>
              </PunditContainer>
            ) : (
              ""
            )}
          </div>
          <div className="box--right">
            {isLoggedIn ? (
              <NotificationFlyout
                numNotifications={numNotifications}
                notificationsById={notificationsById}
                notificationIds={notificationIds}
                markAllAsRead={markAllAsRead}
                updateStatus={updateStatus}
                isLoggedIn={isLoggedIn}
              />
            ) : (
              <Link
                to={{
                  pathname: "/login",
                  state: { lastPath: this.props.location.pathname }
                }}
                className="navbar__nav-item last"
              >
                login
              </Link>
            )}
            <AuthWidget inNavbar={true} />
          </div>
        </nav>
      </div>
    );
  }
}

const mapState = state => {
  const { notificationsById, notificationIds } = getUserNotifications(state);
  return {
    user: state.data.user,
    isAdmin: currentUserIsAdmin(state),
    isLoggedIn: !!state.data.user.id,
    notificationsById,
    notificationIds,
    numNotifications: getUserNotificationCount(state),
    width: state.data.environment.width
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
    fetchUserNotifications() {
      dispatch(fetchUserNotifications());
    },
    markAllAsRead: () => dispatch(updateAllNotificationStatus("read")),
    updateStatus: notification => {
      dispatch(updateNotificationStatus(notification, "read"));
      console.log(notification, notification.uri)
      if (notification.uri) {
        console.log("hello???")
        history.push(notification.uri);
      }
    }
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(asyncPoll(60 * 1000, onPollInterval)(Navbar))
);

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};
