import "./HeroHeader.scss";
import React from "react";

export default ({ title, subtitle, style }) => (
  <div className="hero__header" style={style}>
    <h1 className="hero__header-title">{title}</h1>
    <p className="hero__header-subtitle">{subtitle}</p>
  </div>
);
