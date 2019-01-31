import React, { Fragment } from "react";
import "./ArticleStyleLoader.scss";

export default ({ mobile, headline }) => (
  <div className="loader__wrapper" style={headline ? { height: "400px" } : {}}>
    <div className="loader__wrapper-cell">
      {mobile && headline ? null : (
        <div
          className="loader__image"
          style={
            headline
              ? {
                  height: "400px",
                  width: "50%"
                }
              : { height: "159px", width: "200px" }
          }
        />
      )}
      <div className="loader__text">
        {headline ? (
          <Fragment>
            <div className="loader__headline" />
            <div className="loader__headline" />
            <div className="loader__text-line" />
            <div className="loader__text-line" />
            <div className="loader__text-line" />
          </Fragment>
        ) : null}
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
      </div>
    </div>
  </div>
);
