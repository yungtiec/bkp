import "./Dashboard.scss";
import React, { Component } from "react";
import { QueryDashboardDocumentList, QueryDashboardComments } from "./components";

export default ({}) => {
  return (
    <div className="app-container d-flex pt-4 mb-4">
      <div className="d-flex flex-column dashboard-sidebar pr-4">
        <QueryDashboardDocumentList />
      </div>
      <QueryDashboardComments />
    </div>
  );
};
