import "./TabList.scss";
import React, { Component } from "react";
import { withRouter, matchPath, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getUserContributionStats } from "../data/reducer";

import { TabList } from "./index";

const getParams = pathname => {
  const match = matchPath(pathname, {
    path: `/profile/:userhandle/:tab`,
    exact: true,
    strict: false
  });
  return (match && match.params) || {};
};

const PublicProfileNavbar = ({
  tab,
  switchTab,
  match,
  location,
  num_documents,
  num_comments,
  num_votes
}) => {
  const routeParams = getParams(location.pathname);
  return (
    <div className="profile-navbar app-container d-flex justify-content-between align-items-center">
      <TabList
        tabType="stats"
        tabs={[
          {
            displayName: "All",
            name: "all-contributions",
            stats: num_votes + num_documents + num_comments,
            to: `${match.url}/all-contributions`
          },
          {
            displayName: "Documents",
            name: "documents",
            stats: num_documents,
            to: `${match.url}/documents`
          },
          {
            displayName: "Comments",
            name: "comments",
            stats: num_comments,
            to: `${match.url}/comments`
          },
          {
            displayName: "Likes",
            name: "votes",
            stats: num_votes,
            to: `${match.url}/votes`
          }
        ]}
        currentTab={routeParams.tab}
      />
      <div className="">
        <Link to={`/profile/${routeParams.userhandle}/settings`} exact>
          <i class="fas fa-cog profile__setting-btn" />
        </Link>
      </div>
    </div>
  );
};

const mapState = state => ({
  ...getUserContributionStats(state)
});

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(PublicProfileNavbar)
);
