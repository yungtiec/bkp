import "./Feed.scss";
import React, { Fragment } from "react";
import { HeroHeadline, QueryHeroHeadline } from "./components";

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
      <div className="document-preview__bloc d-flex align-items-stretch mb-3">
        <div className="document-preview__img-wrapper">
          <a />
        </div>
        <div className="document-preview__content ml-4">
          <h6>REGULATORY REQUESTS FOR COMMENT</h6>
          <h5>CFTC Request For Input On Crypto-Asset Mechanics And Markets</h5>
          <p>
            The questions below were originally posted by the CFTC in their
            “Request For Input On Crypto-Asset Mechanics And Markets” on 11
            December 2018, available at
            https://www.cftc.gov/sites/default/files/2018-12/federalregister121118.pdf.
          </p>
          <div className="document-preview__content-bottom d-flex justify-content-between align-items-center">
            <span>JULY 20, 2018</span>
            <div>
              <a className="contribution__action-btn">
                <i className="fas fa-thumbs-up" />
                <span>0</span>
              </a>
              <a className="contribution__action-btn">
                <i className="fas fa-thumbs-down" />
                <span>0</span>
              </a>
              <a className="contribution__action-btn">
                <i className="fas fa-comment" />
                <span>0</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
