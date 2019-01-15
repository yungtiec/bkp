import "./index.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import moment from "moment";
import ReactDOM from "react-dom";
import NotificationItem from "./NotificationItem";

class NotificationFlyout extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      dropdown: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  toggleDropdown() {
    const { dropdown } = this.state;
    this.setState({
      dropdown: !dropdown
    });
    console.log("dropdown");
  }

  handleClickOutside(evt) {
    if (this.wrapperRef && !this.wrapperRef.contains(evt.target))
      this.setState({
        dropdown: false
      });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    const {
      isLoggedIn,
      notificationsById,
      notificationIds,
      numNotifications,
      markAllAsRead,
      updateStatus
    } = this.props;

    if (isLoggedIn)
      return (
        <div className="notification-flyout" ref={this.setWrapperRef}>
          <a
            className="navbar__nav-item notification-count"
            data-count={numNotifications || ""}
            onClick={this.toggleDropdown}
          >
            <i className="fas fa-bell" />
          </a>
          {this.state.dropdown && (
            <div
              className={`notification-flyout__dropdown ${numNotifications >
                4 && "notification-flyout__dropdown--scroll"} `}
            >
              {numNotifications ? (
                <div
                  onClick={markAllAsRead}
                  className="notification-flyout__mark-all-as-read"
                >
                  Mark all as read
                </div>
              ) : (
                <div className="notification-flyout__message">
                  no new notification
                </div>
              )}
              {notificationIds
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
          )}
        </div>
      );
    else return <div />;
  }
}

export default NotificationFlyout;
