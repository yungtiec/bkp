import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Avatar from "react-avatar";
import { PublicProfileNavbar, UserSettingsNavbar } from "./index";

export default ({
  name,
  profileContext,
  isMyProfile,
  avatarUrl,
  getParams
}) => {
  return (
    <div className="profile-header profile-header--with-nav">
      <div className="profile-banner">
        <div className="app-container">
          <div className="profile-avatar__container">
            <Avatar
              className="profile-avatar"
              name={name && name.trim() ? name : "?"}
              size={190}
              src={
                avatarUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              color={"#459DF9"}
              fgColor={"#ffffff"}
            />
          </div>
        </div>
      </div>
      {profileContext === "settings" ? (
        <UserSettingsNavbar getParams={getParams} />
      ) : (
        <PublicProfileNavbar isMyProfile={isMyProfile} getParams={getParams} />
      )}
    </div>
  );
};
