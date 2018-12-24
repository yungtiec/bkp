import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { MainColumn } from "./components";

const PublicProfile = ({ match }) => {
  return (
    <div className="">
      <Switch>
        <Route path={`${match.url}/:tab`} component={MainColumn} />
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
