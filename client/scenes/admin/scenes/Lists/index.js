import "./index.scss";
import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../../../history";
import ProjectSurveyList from "./scenes/ProjectSurveyList";
import UserList from "./scenes/UserList";
import { AdminListSidebar } from "./components";

const AdminList = ({ match }) => {
  return (
    <div className="admin-list">
      <AdminListSidebar />
      <Switch>
        <Route
          path={`${match.url}/project-surveys`}
          component={ProjectSurveyList}
        />
        <Route
          path={`${match.url}/users`}
          component={UserList}
        />
        <Redirect
          from={`${match.url}`}
          exact
          to={`${match.url}/project-surveys`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(AdminList);
