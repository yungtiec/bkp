import "./UserSettings.scss";
import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Account, EditProfile } from "./scenes";

const UserSettings = ({ match, profile }) => {
  return (
    <div className="app-container mt-3 pb-4 d-flex">
      <Switch>
        <Route
          path={`${match.url}/account`}
          render={() => <Account profile={profile} />}
        />
        <Route
          path={`${match.url}/edit`}
          render={() => <EditProfile profile={profile} />}
        />
        <Redirect from={match.url} exact to={`${match.url}/account`} />
      </Switch>
    </div>
  );
};

export default withRouter(UserSettings);
