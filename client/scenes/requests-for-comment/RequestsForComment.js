import React, { Fragment } from "react";
import { QuestionFilter } from "./components";
import { HeroHeader } from "../../components";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";

const List = () => "There's no request for comment at this moment";

const Temp = () => "temp";

const RequestsForComment = ({ match }) => {
  console.log(match.url);
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
          <Route path={`${match.url}`} component={List} />
          <Route path={`${match.url}/create`} component={Temp} />
        </Switch>
      </div>
    </Fragment>
  );
};

export default withRouter(RequestsForComment);
