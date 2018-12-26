import "./ProfileDetails.scss";
import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";

const isDev = process.env.NODE_ENV === "development";

const ProfileDetails = ({ match, profile }) => {
  return isDev ? (
    <div className="profile-details">
      <h5 className="profile-details__name ">{profile.name}</h5>
      <p className="profile-details__user-handle">@{profile.user_handle}</p>
      <p className="profile-details__self-introduction">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </p>
      <p className="profile-details__current-career-role">
        Product manager at Consensys
      </p>
      <div>
        <p className="profile-details--with-icons">
          <i class="fas fa-map-marker-alt" />New York, US
        </p>
        <p className="profile-details--with-icons">
          <i class="fas fa-clock" />Joined{" "}
          {moment(profile.createdAt).format("MMM YYYY")}
        </p>
        <a className="profile-details--with-icons">
          <i class="fas fa-link" />nicolaaskoster.me
        </a>
        <p className="profile-details--with-icons">
          <i class="fas fa-graduation-cap" />University of Pennsylvania
        </p>
      </div>
      <div className="profile-details__social-media-container">
        <span className="profile-details__social-media-link">
          <i class="fab fa-linkedin-in" />
        </span>
        <span className="profile-details__social-media-link">
          <i class="fab fa-twitter" />
        </span>
        <span className="profile-details__social-media-link">
          <i class="fab fa-github" />
        </span>
        <span className="profile-details__social-media-link">
          <i class="fab fa-stack-overflow" />
        </span>
      </div>
    </div>
  ) : (
    <div className="profile-details">
      <h5>{profile.name}</h5>
      <p>@{profile.user_handle}</p>
      {profile.self_introduction && <p>{profile.self_introduction}</p>}
      <div className="p-2" />
      <p>Joined {moment(profile.createdAt).format("MMM YYYY")}</p>
      {profile.website_url && <a>{profile.website_url}</a>}
    </div>
  );
};

export default withRouter(ProfileDetails);
