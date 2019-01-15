import "./ProfileNavbar.scss";
import React from "react";
import { Link, withRouter } from "react-router-dom";

export default ({ url, activeTab, isMyProfile }) => (
  <div className="profile-navbar">
    <ul className="profile-navbar__list">
      <Link to={`${url}/about`}>
        <li
          className={`profile-navbar__item ${
            activeTab === "about" ? "active" : ""
          }`}
        >
          About
        </li>
      </Link>
      {isMyProfile ? (
        <Link to={`${url}/notifications`}>
          <li
            className={`profile-navbar__item ${
              activeTab === "notifications" ? "active" : ""
            }`}
          >
            Notifications
          </li>
        </Link>
      ) : null}
      <Link to={`${url}/comments`}>
        <li
          className={`profile-navbar__item ${
            activeTab === "comments" ? "active" : ""
          }`}
        >
          Comments
        </li>
      </Link>
      <Link to={`${url}/password`}>
        <li
          className={`profile-navbar__item ${
            activeTab === "password" ? "active" : ""
            }`}
        >
          Password
        </li>
      </Link>
    </ul>
  </div>
);
