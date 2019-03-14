import "./FilterBar.scss";
import React from "react";

export default ({ children, marginClass }) => (
  <div className={`feed__filter-container ${marginClass}`}>
    <div className="feed__filter d-flex">{children}</div>
  </div>
);
