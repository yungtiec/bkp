import "./TabList.scss";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

const Tab = ({ to, name, displayName, currentTab, stats, tabType }) => (
  <Link to={to}>
    <li className={`tab-list__item ${currentTab === name ? "active" : ""}`}>
      <span
        className={`tab-list__item-label ${
          tabType !== "stats" ? "tab-list__item-label--pull-down" : ""
        }`}
      >
        {displayName}
      </span>
      <span
        className={`tab-list__item-stats ${
          stats ? "" : "tab-list__item-stats--hidden"
        }`}
      >
        {stats ? stats : 0}
      </span>
    </li>
  </Link>
);

export default ({ tabs, currentTab, tabType }) => {
  const activeTab = "about";

  return (
    <ul className="tab-list">
      {tabs.map(tab => (
        <Tab {...tab} currentTab={currentTab} tabType={tabType} />
      ))}
    </ul>
  );
};
