import "./Feed.scss";
import React, { Fragment } from "react";
import {
  QueryDocumentList,
  QueryHeroHeadline,
  DocumentFilter
} from "./components";

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
    <DocumentFilter />
    <div className="app-container">
      <QueryDocumentList />
    </div>
  </Fragment>
);
