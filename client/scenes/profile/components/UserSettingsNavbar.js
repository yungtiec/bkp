import "./TabList.scss";
import React, { Component } from "react";
import { withRouter, matchPath, Link } from "react-router-dom";
import { TabList } from "./index";

const UserSettingsNavbar = ({ tab, match, location, getParams, mobile }) => {
  const routeParams = getParams(
    `/profile/:userhandle/settings/:tab`,
    location.pathname
  );
  return (
    <div
      className={`profile-navbar app-container d-flex justify-content-${
        mobile ? "center" : "between"
      } align-items-center`}
    >
      <TabList
        tabType="label"
        tabs={[
          {
            displayName: "Account",
            name: "account",
            to: `${match.url}/settings/account`
          },
          {
            displayName: "Edit Profile",
            name: "edit",
            to: `${match.url}/settings/edit`
          },
          {
            displayName: "Notifications",
            name: "notification-settings",
            to: `${match.url}/settings/notification-settings`
          }
        ]}
        currentTab={routeParams.tab}
      />
      {mobile ? null : (
        <Link className="btn btn-outline-primary" to={`${match.url}`}>
          View my profile
        </Link>
      )}
    </div>
  );
};

export default withRouter(UserSettingsNavbar);
