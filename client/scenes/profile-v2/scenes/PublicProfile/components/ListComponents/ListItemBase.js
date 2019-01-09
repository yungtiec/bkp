import "./ListItemBase.scss";
import React, { Fragment } from "react";

export default ({ icon, titleElement, subtitleElements, actionElements }) => {
  return (
    <div className="list-item-base list-item-base--with-theme">
      <div className="list-item-base__theme-icon">
        <i class={`fas fa-${icon}`} />
      </div>
      <div
        className={`list-item-base__main-content ${!actionElements &&
          "list-item-base__main-content--without-action-elements"}`}
      >
        {titleElement && (
          <div>
            <span className="list-item-base__title">{titleElement}</span>
          </div>
        )}
        {subtitleElements && (
          <div className="list-item-base__subtitle">
            {subtitleElements.map((e, i) => (
              <Fragment>
                <div className="list-item-base__subtitle-item">{e}</div>
                {i !== subtitleElements.length - 1 && (
                  <span className="mx-2">•</span>
                )}
              </Fragment>
            ))}
          </div>
        )}
        {actionElements && (
          <div className="list-item-base__action-elements">
            {actionElements}
          </div>
        )}
      </div>
    </div>
  );
};
