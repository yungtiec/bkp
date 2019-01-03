import "./TabList.scss";
import React, { Component } from "react";
import { withRouter, matchPath, Link } from "react-router-dom";
import { TabList } from "./index";

const getParams = pathname => {
  const match = matchPath(pathname, {
    path: `/profile/:userhandle/settings/:tab`,
    exact: true,
    strict: false
  });
  return (match && match.params) || {};
};

const UserSettingsNavbar = ({ tab, match, location }) => {
  const routeParams = getParams(location.pathname);
  return (
    <div className="profile-navbar app-container d-flex justify-content-between align-items-center">
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
          }
        ]}
        currentTab={routeParams.tab}
      />
      <Link className="btn btn-outline-primary" to={`${match.url}`}>
        View my profile
      </Link>
    </div>
  );
};

export default withRouter(UserSettingsNavbar);
