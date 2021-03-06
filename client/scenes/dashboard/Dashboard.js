import "./Dashboard.scss";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  QueryDashboardDocumentList,
  QueryDashboardComments
} from "./components";
import {withRouter} from 'react-router-dom';
import {requiresAuthorization} from '../../components';

const Dashboard = ({ screenWidth }) => {
  return (
    <div className="app-container d-flex pt-4 mb-4">
      {screenWidth > 970 ? (
        <Fragment>
          <div className="d-flex flex-column dashboard-sidebar pr-4">
            <QueryDashboardDocumentList />
          </div>
          <QueryDashboardComments />
        </Fragment>
      ) : (
        <QueryDashboardComments mobile={screenWidth <= 970} />
      )}
    </div>
  );
};

const mapState = (state, ownProps) => ({
  screenWidth: state.data.environment.width
});

const actions = {};

const authorizedDashboard = withRouter(
  requiresAuthorization({
    Component: Dashboard,
    roleRequired: ["admin"]
  })
);

export default connect(
  mapState,
  actions
)(authorizedDashboard);
