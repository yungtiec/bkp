import "./Feed.scss";
import React, { Fragment } from "react";

export default () => (
  <Fragment>
    <div className="app-container">
      <div className="feed__header">
        <h1 className="feed__header-title">The Brooklyn Project</h1>
        <p className="feed__header-subtitle">
          Making public blockchains safe or another killer slogan.
        </p>
      </div>
      <div className="feed__features d-flex ">
        <div className="feed__feature-img-wrap">
          <img
            className="feed__feature-img"
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=2492&q=80"
          />
        </div>
        <div className="feed__feature-articles-container ml-5 d-flex align-items-baseline flex-column">
          <div className="feed__feature-articles-navigation w-100 d-flex justify-content-between align-items-baseline">
            <div className="feed__sections-index">
              <span className="feed__sections-index-current">
                <span className="feed__sections-index-inner">01</span>
              </span>
              <span className="feed__sections-index-total">04</span>
            </div>
            <div className="feed__feature-articles-nav-btns">
              <span className="feed__feature-articles-nav-btn">
                <i className="fas fa-caret-left" />
              </span>
              <span className="feed__feature-articles-nav-btn">
                <i className="fas fa-caret-right" />
              </span>
            </div>
          </div>
          <div className="feed__feature-article-title">
            Reality check: Trump's claims on immigrants and crime
          </div>
          <div className="feed__feature-article-content ml-3">
            In a national address from the Oval Office Tuesday night, President
            Trump defended his demand for a wall on the southern border with
            Mexico by claiming unauthorized immigrants bring crime and drugs
            into the United States at devastating levels. <br /> Reality check:
            The majority of immigrants arrested by U.S. Customs and Border
            Protection have had no criminal history. The vast majority of
            opioids seized at the border, meanwhile, come through legal ports of
            entry.
          </div>
          <div className="feed__feature-actions">
            <div className="feed__feature-action-read-more">READ MORE</div>
          </div>
        </div>
      </div>
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
