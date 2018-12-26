import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { MainColumn, LeftColumn } from "./components";

const PublicProfile = ({ match, profile }) => {
  return (
    <div className="app-container mt-3 d-flex">
      <LeftColumn profile={profile} gridClassnames="w-25" />
      <Switch>
        <Route
          path={`${match.url}/:tab`}
          render={() => <MainColumn profile={profile} gridClassnames="w-75"/>}
        />
        <Redirect
          from={match.url}
          exact
          to={`${match.url}/all-contributions`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(PublicProfile);
