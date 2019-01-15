import "./Feed.scss";
import React from "react";

export default () => (
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
          Mexico by claiming unauthorized immigrants bring crime and drugs into
          the United States at devastating levels. <br /> Reality check: The
          majority of immigrants arrested by U.S. Customs and Border Protection
          have had no criminal history. The vast majority of opioids seized at
          the border, meanwhile, come through legal ports of entry.
        </div>
        <div className="feed__feature-actions">
          <div className="feed__feature-action-read-more">READ MORE</div>
        </div>
      </div>
    </div>
  </div>
);
