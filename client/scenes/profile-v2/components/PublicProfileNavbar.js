import "./TabList.scss";
import React, { Component } from "react";
import { TabList } from "./index";

export default ({}) => {
  return (
    <div className="profile-navbar app-container d-flex justify-content-between align-items-center">
      <TabList
        tabType="stats"
        tabs={[
          {
            displayName: "All",
            name: "all",
            stats: 10,
            to: ""
          },
          {
            displayName: "Documents",
            name: "documents",
            stats: 10,
            to: ""
          },
          {
            displayName: "Comments",
            name: "comments",
            stats: 10,
            to: ""
          },
          {
            displayName: "Likes",
            name: "likes",
            stats: 10,
            to: ""
          }
        ]}
        defaultTab="all"
        currentTab="documents"
      />
      <div className="">
        <i class="fas fa-cog profile__setting-btn" />
      </div>
    </div>
  );
};
