import "./ProfileHeader.scss";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Avatar from "react-avatar";
import { PublicProfileNavbar, UserSettingsNavbar } from "./index";

export default ({ name, profileContext, isMyProfile, avatarUrl }) => {
  return (
    <div className="profile-header profile-header--with-nav">
      <div className="profile-banner">
        <div className="app-container">
          <div className="profile-avatar__container">
            <Avatar
              className="profile-avatar"
              name={name.trim() ? name : "?"}
              size={190}
              src={avatarUrl}
              color={"#459DF9"}
              fgColor={"#ffffff"}
            />
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
