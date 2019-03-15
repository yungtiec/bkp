import "./TagChip.scss";
import React from "react";

export default ({ tagValue, closeIconOnClick, containerClassname }) => (
  <div className={containerClassname}>
    {closeIconOnClick ? (
      <span className="close-icon" onClick={closeIconOnClick}>
        x
      </span>
    ) : null}
    <span className="select-value-label">
      {tagValue}
      <span className="select-aria-only">&nbsp;</span>
    </span>
  </div>
);
