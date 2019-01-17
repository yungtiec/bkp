import "./ListItemAttached.scss";
import React, { Fragment } from "react";

export default ({
  verticalDivider,
  icon,
  quote,
  text,
  actionElements,
  onClick
}) => {
  return (
    <div
      className="list-item-attached list-item-attached--base-with-theme"
      onClick={onClick}
    >
      <div className="list-item-base__theme-icon">
        {icon && <i class={`fas fa-${icon}`} />}
        {verticalDivider && (
          <div className="list-item-attached__vertical-divider" />
        )}
      </div>
      <div
        className={`list-item-attached__main-content ${!actionElements &&
          "list-item-attached__main-content--without-action-elements"}`}
      >
        {quote && (
          <div>
            <span className="list-item-attached__quote">{quote}</span>
          </div>
        )}
        {text && (
          <div>
            <span className="list-item-attached__text">{text}</span>
          </div>
        )}
        {actionElements && (
          <div className="list-item-attached__action-elements">
            {actionElements}
          </div>
        )}
      </div>
    </div>
  );
};
