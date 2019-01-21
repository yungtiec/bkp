import "./Feed.scss";
import React, { Fragment } from "react";
import { QueryDocumentList, QueryHeroHeadline } from "./components";

export default () => (
  <Fragment>
    <div className="app-container">
      <div className="feed__header">
        <h1 className="feed__header-title">The Brooklyn Project</h1>
        <p className="feed__header-subtitle">
          Making public blockchains safe or another killer slogan.
        </p>
      </div>
      <QueryHeroHeadline />
    </div>
    <div className="feed__filter-container my-5">
      <ul className="feed__filter d-flex">
        <li className="feed__filter-item feed__filter-label">sort by</li>
        <li className="feed__filter-item">hot</li>
        <li className="feed__filter-item feed__filter-label">filter by</li>
        <li className="feed__filter-item">tags</li>
        <li className="feed__filter-item">sections</li>
        <li className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
          <i className="fas fa-search" />
          <a className="feed__filter-clear">CLEAR FILTERS</a>
        </li>
      </ul>
    </div>
    <div className="app-container">
      <QueryDocumentList />
    </div>
  </Fragment>
);
