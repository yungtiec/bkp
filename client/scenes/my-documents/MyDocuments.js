import React from "react";
import { withRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { Drafts, PublishedDocuments, FeaturedDocuments } from "./scenes";
import { MyDocumentsNavbar } from "./components";

export default ({ match }) => {
  const activeTab = window.location.pathname.split("/")[3];
  return (
    <div className="main-container">
      <div className="d-flex justify-content-between my-3">
        <h4>Your documents</h4>
        <button className="btn btn-outline-primary">
          <Link to="/wizard">Create a scorecard</Link>
        </button>
      </div>
      <MyDocumentsNavbar activeTab={activeTab} url={match.url} />
      <Switch>
        <Route path={`${match.url}/drafts`} component={Drafts} />
        <Route path={`${match.url}/published`} component={PublishedDocuments} />
        <Route path={`${match.url}/featured`} component={FeaturedDocuments} />
        <Redirect from={match.url} to={`${match.url}/drafts`} />
      </Switch>
    </div>
  );
};
