import React from "react";
import "./ArticleStyleLoader.scss";

export default ({ mobile, headline }) => (
  <div className="loader__wrapper">
    <div className="loader__wrapper-cell">
      {<div className="loader__image" />}
      <div className="loader__text">
        <div className="loader__headline" />
        <div className="loader__headline" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
        <div className="loader__text-line" />
      </div>
    </div>
  </div>
);
