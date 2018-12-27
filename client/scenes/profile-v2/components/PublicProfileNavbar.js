import "./TabList.scss";
import React, { Component } from "react";
import { withRouter, matchPath } from "react-router-dom";

import { TabList } from "./index";

const getParams = pathname => {
  const match = matchPath(pathname, {
    path: `/profile/:userhandle/:tab`,
    exact: true,
    strict: false
  });
  return (match && match.params) || {};
};

const PublicProfileNavbar = ({ tab, switchTab, match, location }) => {
  const routeParams = getParams(location.pathname);
  return (
    <div className="profile-navbar app-container d-flex justify-content-between align-items-center">
      <TabList
        tabType="stats"
        onSelect={() => {}}
        tabs={[
          {
            displayName: "All",
            name: "all-contributions",
            stats: 10,
            to: `${match.url}/all-contributions`
          },
          {
            displayName: "Documents",
            name: "documents",
            stats: 10,
            to: `${match.url}/documents`
          },
          {
            displayName: "Comments",
            name: "comments",
            stats: 10,
            to: `${match.url}/comments`
          },
          {
            displayName: "Likes",
            name: "votes",
            stats: 10,
            to: `${match.url}/votes`
          }
        ]}
        currentTab={routeParams.tab}
      />
      <div className="">
        <i class="fas fa-cog profile__setting-btn" />
      </div>
    </div>
  );
};

export default withRouter(PublicProfileNavbar);
