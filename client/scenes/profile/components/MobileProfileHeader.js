import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Avatar from "react-avatar";
import {
  PublicProfileNavbar,
  UserSettingsNavbar,
  ProfileDetails
} from "./index";

export default ({
  name,
  profileContext,
  isMyProfile,
  avatarUrl,
  profile,
  screenWidth,
  getParams
}) => {
  const routeParams = getParams(`/profile/:userhandle/:tab`, location.pathname);

  return (
    <Fragment>
      <div style={{ background: "white" }} className="text-center">
        <Avatar
          name={name && name.trim() ? name : "?"}
          size={150}
          src={
            avatarUrl ||
            "/assets/blank-avatar.png"
          }
          color={"#459DF9"}
          fgColor={"#ffffff"}
        />
      </div>
      <ProfileDetails
        isMyProfile={isMyProfile}
        profile={profile}
        mobile={true}
      />
      <div className="profile-header profile-header--with-nav">
        {profileContext === "settings" ? (
          <UserSettingsNavbar mobile={true} getParams={getParams} />
        ) : (
          <PublicProfileNavbar
            isMyProfile={isMyProfile}
            mobile={true}
            getParams={getParams}
          />
        )}
      </div>
    </Fragment>
  );
};
