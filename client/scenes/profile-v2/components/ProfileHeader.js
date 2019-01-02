import "./ProfileHeader.scss";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { PublicProfileNavbar, UserSettingsNavbar } from "./index";

export default ({ profileContext }) => {
  return (
    <div className="profile-header profile-header--with-nav">
      <div className="profile-banner">
        <div className="app-container">
          <div className="profile-avatar__container">
            <div className="profile-avatar" />
          </div>
        </div>
      </div>
      {profileContext === "settings" ? (
        <UserSettingsNavbar />
      ) : (
        <PublicProfileNavbar />
      )}
    </div>
  );
};