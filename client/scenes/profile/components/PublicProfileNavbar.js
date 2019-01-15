import "./TabList.scss";
import React, { Fragment } from "react";
import { withRouter, matchPath, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getUserContributionStats } from "../data/reducer";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
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
  isMyProfile,
  match,
  location,
  num_documents,
  num_comments,
  num_votes,
  notify
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
      <div className="d-flex">
        {isMyProfile && (
          <Fragment>
            <Link to={`/profile/${routeParams.userhandle}/settings`} exact>
              <i className="fas fa-cog profile__setting-btn" />
            </Link>
            <CopyToClipboard
              text={`${window.location.origin}/profile/${
                routeParams.userhandle
              }`}
              onCopy={() =>
                notify({
                  title: "Profile link copied to clipboard",
                  message: "",
                  status: "success",
                  dismissible: true,
                  dismissAfter: 3000
                })
              }
            >
              <button className="btn btn-outline-primary ml-2">
                Share my profile
              </button>
            </CopyToClipboard>
          </Fragment>
        )}
      </div>
    </div>
  );
};

const mapState = (state, ownProps) => ({
  ...getUserContributionStats(state),
  ...ownProps
});

const actions = {
  notify
};

export default withRouter(
  connect(
    mapState,
    actions
  )(PublicProfileNavbar)
);
