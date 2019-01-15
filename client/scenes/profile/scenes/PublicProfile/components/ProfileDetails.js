import "./ProfileDetails.scss";
import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { getUserProfile } from "../../../data/reducer";

const renderTags = (tags, icon) =>
  tags && (
    <div className="profile-details--with-icons d-flex">
      <i class={`fas fa-${icon}`} style={{ lineHeight: 1.5 }} />
      <div>{tags.map(l => <div>{l.display_name}</div>)}</div>
    </div>
  );

const badgeIcons = {
  "Authenticated User": "shield",
  "Top Telegram Contributor": "badge"
};

const renderBadges = badges =>
  badges && (
    <div className="mb-4">
      {badges.map(badge => (
        <div className="d-flex align-items-center profile-details__badge">
          <i
            data-vi={badgeIcons[badge.name]}
            data-vi-primary="#00AFFF"
            data-vi-size="35"
          />
          <span>{badge.name}</span>
        </div>
      ))}
    </div>
  );

const ProfileDetails = ({ match, profile }) => {
  return (
    <div className="profile-details">
      <h5 className="profile-details__name ">{profile.name}</h5>
      <p className="profile-details__user-handle">@{profile.user_handle}</p>
      {profile.self_introduction ? (
        <p className="profile-details__self-introduction">
          {profile.self_introduction}
        </p>
      ) : null}
      {renderBadges(profile.badges)}
      <div>
        {profile.organization && (
          <p className="profile-details--with-icons">
            <i class="fas fa-building" />
            {profile.organization}
          </p>
        )}
        {renderTags(profile.careerRole, "briefcase")}
        {renderTags(profile.location, "map-marker-alt")}
        <p className="profile-details--with-icons">
          <i class="fas fa-clock" />Joined{" "}
          {moment(profile.createdAt).format("MMM YYYY")}
        </p>
        {renderTags(profile.education, "map-marker-alt")}
        {profile.website_url && (
          <a className="profile-details--with-icons">
            <i class="fas fa-link" />
            {profile.website_url}
          </a>
        )}
      </div>
      <div className="profile-details__social-media-container">
        {profile.linkedin_url && (
          <span className="profile-details__social-media-link">
            <i class="fab fa-linkedin-in" />
          </span>
        )}
        {profile.twitter_url && (
          <span className="profile-details__social-media-link">
            <i class="fab fa-twitter" />
          </span>
        )}
        {profile.github_url && (
          <span className="profile-details__social-media-link">
            <i class="fab fa-github" />
          </span>
        )}
        {profile.stackoverflow_url && (
          <span className="profile-details__social-media-link">
            <i class="fab fa-stack-overflow" />
          </span>
        )}
      </div>
    </div>
  );
};

export default withRouter(ProfileDetails);
