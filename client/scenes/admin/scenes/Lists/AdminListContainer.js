import "./AdminListContainer.scss";
import React, { Component } from "react";
import { withRouter, route, Switch, Route, Redirect } from "react-router-dom";
import history from "../../../../history";
import QueryAdminDocumentList from "./scenes/AdminDocumentList/QueryAdminDocumentList";
import QueryAdminUserList from "./scenes/AdminUserList/QueryAdminUserList";
import { AdminListSidebar } from "./components";

const AdminListContainer = ({ match }) => {
  return (
    <div className="admin-list">
      <AdminListSidebar />
      <Switch>
        <Route
          path={`${match.url}/documents`}
          component={QueryAdminDocumentList}
        />
        <Route path={`${match.url}/users`} component={QueryAdminUserList} />
        <Redirect
          from={`${match.url}`}
          exact
          to={`${match.url}/documents`}
        />
      </Switch>
    </div>
  );
};

export default withRouter(AdminListContainer);
