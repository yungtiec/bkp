import React, { Fragment } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import {
  QuestionEditorContainer,
  QueryQuestion,
  QuestionIndex
} from "./components";
import { Question } from "./scenes";

const RequestsForComment = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/create`} component={QuestionEditorContainer} />
      <Route path={`${match.url}/:slug`} component={Question} />
      <Route path={`${match.url}`} component={QuestionIndex} />
    </Switch>
  );
};

export default withRouter(RequestsForComment);
