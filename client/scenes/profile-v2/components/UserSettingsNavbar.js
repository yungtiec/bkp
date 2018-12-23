import "./TabList.scss";
import React, { Component } from "react";
import { TabList } from "./index";

export default ({}) => {
  return (
    <div className="profile-navbar app-container d-flex justify-content-between align-items-center">
      <TabList
        tabType="label"
        tabs={[
          {
            displayName: "Account",
            name: "account",
            to: ""
          },
          {
            displayName: "Edit Profile",
            name: "edit profile",
            to: ""
          }
        ]}
        defaultTab="account"
        currentTab="account"
      />
      <div className="">
        <button className="btn btn-outline-danger mr-2">Cancel</button>
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};
