import "./Cards.scss";
import React from "react";

const Cards = () => (
  <div className="landing__cards">
    <div className="landing__title">From our contributors</div>
    <div className="card-grid">
      <div className="card-wrap">
        <h2 className="title title--preview">
          The Crypto Travel Rule: Challenges and Solutions
        </h2>
        <div className="divider" />{" "}
        <span className="author">by Malcolm Wright</span>
        <div className="meta meta--preview">
          <img
            className="meta__avatar"
            src="https://the-bkp.s3.amazonaws.com/malcolmwright-Malcolm%20Wright%20-%20SQ.jpg-2019-07-10T11%3A43%3A06%2B00%3A00"
            alt="author04"
          />
        </div>
      </div>
      <div className="card-wrap">
        <h2 className="title title--preview">
          Podcast Ep 002: Hong Kong University Professor Brian Tang On Hong
          Kong's Token Regulatory Landscape
        </h2>
        <div className="divider" />
        <span className="author">by Joyce Lai</span>
        <div className="meta meta--preview">
          <img
            className="meta__avatar"
            src="https://the-bkp.s3.amazonaws.com/joycelai-JoyceLaiHeadshotBW.jpg-2019-04-15T16%3A01%3A41%2B00%3A00"
            alt="author04"
          />
        </div>
      </div>
      <div className="card-wrap">
        <h2 className="title title--preview">
          Consortium blockchain governance: a key issue for enterprise
          blockchain projects
        </h2>
        <div className="divider" />
        <span className="author">by Mark Radcliffe</span>
        <div className="meta meta--preview">
          <img
            className="meta__avatar"
            src="/assets/blank-avatar.png"
            alt="author04"
          />
        </div>
      </div>
      <div className="card-wrap">
        <p>View more ></p>
      </div>
    </div>
  </div>
);

export default Cards;
