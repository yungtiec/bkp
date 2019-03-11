import React, { Fragment } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { NewQuestion, QueryQuestion, QuestionIndex } from "./components";

const RequestsForComment = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/create`} component={NewQuestion} />
      <Route path={`${match.url}/:slug`} component={QueryQuestion} />
      <Route path={`${match.url}`} component={QuestionIndex} />
    </Switch>
  );
};

export default withRouter(RequestsForComment);
