import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { MainColumn, LeftColumn } from "./components";
import { getUserProfile } from "../../data/reducer";

const PublicProfile = ({ match, profile }) => {
  return (
    <div className="app-container mt-3 pb-4 d-flex">
      <LeftColumn gridClassnames="w-25" profile={profile} />
      <Switch>
        <Route
          path={`${match.url}/:tab`}
          render={() => <MainColumn profile={profile} gridClassnames="w-75" />}
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

const mapState = (state, ownProps) => ({
  profile: getUserProfile(state),
  ...ownProps
});

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(PublicProfile)
);
