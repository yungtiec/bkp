import "./ProfileHeader.scss";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { PublicProfileNavbar, UserSettingsNavbar } from "./index";

export default ({ profileContext, isMyProfile, avatarUrl }) => {
  return (
    <div className="profile-header profile-header--with-nav">
      <div className="profile-banner">
        <div className="app-container">
          <div className="profile-avatar__container">
            {avatarUrl ? (
              <img
                className="profile-avatar"
                width="200"
                height="200"
                src={avatarUrl.replace("sz=50", "sz=200")}
              />
            ) : (
              <div className="profile-avatar" />
            )}
          </div>
        </div>
      </div>
      {profileContext === "settings" ? (
        <UserSettingsNavbar />
      ) : (
        <PublicProfileNavbar isMyProfile={isMyProfile} />
      )}
    </div>
  );
};
