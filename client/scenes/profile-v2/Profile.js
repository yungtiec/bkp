import "./Profile.scss";
import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ProfileHeader } from "./components";
import { PublicProfile, UserSettings } from "./scenes";

const Profile = ({ match, location }) => {
  const profileContext = location.pathname.split("/")[3];
  return (
    <div className="profile">
      <ProfileHeader profileContext={profileContext} />
      <Switch>
        <Route path={`${match.url}/settings`} component={UserSettings} />
        <Route path={`${match.url}`} component={PublicProfile} />} />
      </Switch>
    </div>
  );
};

export default withRouter(Profile);
