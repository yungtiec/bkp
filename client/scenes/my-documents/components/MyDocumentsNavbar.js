import "./MyDocumentsNavbar.scss";
import React from "react";
import { Link, withRouter } from "react-router-dom";

export default ({ url, activeTab }) => (
  <div className="my-documents-navbar">
    <ul className="my-documents-navbar__list">
      <Link to={`${url}/drafts`}>
        <li
          className={`my-documents-navbar__item ${
            activeTab === "drafts" ? "active" : ""
          }`}
        >
          Drafts
        </li>
      </Link>
      <Link to={`${url}/published`}>
        <li
          className={`my-documents-navbar__item ${
            activeTab === "published" ? "active" : ""
          }`}
        >
          Published
        </li>
      </Link>
      <Link to={`${url}/featured`}>
        <li
          className={`my-documents-navbar__item ${
            activeTab === "featured" ? "active" : ""
            }`}
        >
          Featured
        </li>
      </Link>
    </ul>
  </div>
);
