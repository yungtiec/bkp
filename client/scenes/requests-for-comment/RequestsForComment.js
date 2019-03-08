import React, { Fragment } from "react";
import { QuestionFilter } from "./components";
import { HeroHeader } from "../../components";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { NewQuestion, QueryQuestion, QueryQuestionList } from "./components";

const RequestsForComment = ({ match }) => {
  return (
    <Fragment>
      <div className="app-container">
        <HeroHeader
          title="Requests For Comment"
          subtitle="Join the collaboration on blockchain law, regulation, and policy."
        />
      </div>
      <QuestionFilter marginClass="mb-5 pt-4" />
      <div className="app-container">
        <Switch>
          <Route path={`${match.url}/create`} component={NewQuestion} />
          <Route path={`${match.url}/:slug`} component={QueryQuestion} />
          <Route path={`${match.url}`} component={QueryQuestionList} />
        </Switch>
      </div>
    </Fragment>
  );
};

export default withRouter(RequestsForComment);
