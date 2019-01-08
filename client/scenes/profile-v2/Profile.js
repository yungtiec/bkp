import "./Profile.scss";
import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ProfileHeader } from "./components";
import { PublicProfile, UserSettings } from "./scenes";

const Profile = ({ me, profile, match, location }) => {
  const profileContext = location.pathname.split("/")[3];
  const isMyProfile = me.user_handle === profile.user_handle;
  return (
    <div className="profile">
      <ProfileHeader
        profileContext={profileContext}
        isMyProfile={isMyProfile}
      />
      <Switch>
        {isMyProfile && (
          <Route path={`${match.url}/settings`} component={UserSettings} />
        )}
        <Route path={`${match.url}`} component={PublicProfile} />
      </Switch>
    </div>
  );
};

export default withRouter(Profile);
