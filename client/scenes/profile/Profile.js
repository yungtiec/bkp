import "./Profile.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ProfileBanner, ProfileNavbar } from "./components";
import {
  QueryPassword,
  QueryNotifications,
  QueryComments,
  About
} from "./scenes";
import autoBind from "react-autobind";
import moment from "moment";

// actions - profile/about
import {
  fetchUserBasicInfo,
  changeAccessStatus,
  changeAnonymity
} from "./scenes/about/data/actions";

// selectors - profile/about
import { getUserBasicInfo } from "./scenes/about/data/reducer";

// selectors - users
import { currentUserIsAdmin, editProfile } from "../../data/reducer";

const Profile = ({
  basicInfo,
  match,
  isAdmin,
  myUserId,
  restrictAccess,
  restoreAccess,
  resetUserData,
  changeAnonymity,
  editProfile,
  updateUserPassword
}) => {
  const activeTab = window.location.pathname.split("/")[3];
  const isMyProfile =
    match.params.userId === "profile" || match.params.userId === myUserId;

  return (
    <div className="profile-container">
      <ProfileBanner
        name={basicInfo.name}
        isAdmin={isAdmin}
        restrictedAccess={basicInfo.restricted_access}
        numComments={basicInfo.num_comments}
        numVersionComments={basicInfo.num_version_comments}
        numIssues={basicInfo.num_issues}
        joinDate={moment(basicInfo.createdAt).format("MMM YYYY")}
        managedProjects={basicInfo.managedProjects}
        editedProjects={basicInfo.editedProjects}
        role={basicInfo.roles && basicInfo.roles[0]}
        restrictAccess={restrictAccess}
        restoreAccess={restoreAccess}
      />
      <ProfileNavbar
        activeTab={activeTab}
        url={match.url}
        isMyProfile={isMyProfile}
      />
      <Switch>
        <Route
          path={`${match.url}/about`}
          render={props => (
            <About
              changeAnonymity={changeAnonymity}
              editProfile={editProfile}
              resetUserData={resetUserData}
              isMyProfile={isMyProfile}
              {...basicInfo}
              {...props}
            />
          )}
        />
        <Route path={`${match.url}/comments`} component={QueryComments} />
        {isMyProfile && (
          <Route
            path={`${match.url}/notifications`}
            component={QueryNotifications}
          />
        )}
        {isMyProfile && (
          <Route
            path={`${match.url}/password`}
            render={props => (
              <QueryPassword
                isMyProfile={isMyProfile}
                updateUserPassword={updateUserPassword}
                myUserId={myUserId}
                {...props}
              />
            )}
          />
        )}
        <Redirect from={match.url} exact to={`${match.url}/about`} />
      </Switch>
    </div>
  );
};

export default withRouter(Profile);
