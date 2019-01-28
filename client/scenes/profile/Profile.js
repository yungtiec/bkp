import "./Profile.scss";
import "./components/ProfileHeader.scss";
import React, { Component } from "react";
import { withRouter, Switch, Route, matchPath } from "react-router-dom";
import PropTypes from "prop-types";
import { ProfileHeader, MobileProfileHeader } from "./components";
import { PublicProfile, UserSettings } from "./scenes";
import { Unauthorized } from "../index";

const getParams = (pathToCompare, pathname) => {
  const match = matchPath(pathname, {
    path: pathToCompare,
    exact: true,
    strict: false
  });
  return (match && match.params) || {};
};

const Profile = ({ me, profile, match, location, screenWidth }) => {
  const profileContext = location.pathname.split("/")[3];
  const isMyProfile = me && me.user_handle === profile.user_handle;
  const isInUserSettings = location.pathname.indexOf("/settings") !== -1;

  return !isMyProfile && isInUserSettings ? (
    <Unauthorized />
  ) : (
    <div className="profile">
      {screenWidth > 992 ? (
        <ProfileHeader
          profileContext={profileContext}
          isMyProfile={isMyProfile}
          avatarUrl={profile.avatar_url}
          name={profile.name}
          getParams={getParams}
        />
      ) : (
        <MobileProfileHeader
          profileContext={profileContext}
          isMyProfile={isMyProfile}
          avatarUrl={profile.avatar_url}
          name={profile.name}
          profile={profile}
          screenWidth={screenWidth}
          getParams={getParams}
        />
      )}
      <Switch>
        {isMyProfile ? (
          <Route path={`${match.url}/settings`} component={UserSettings} />
        ) : null}
        <Route path={`${match.url}`} component={PublicProfile} />
      </Switch>
    </div>
  );
};

export default withRouter(Profile);
