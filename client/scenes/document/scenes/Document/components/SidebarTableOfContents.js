import "./SidebarTableOfContents.scss";
import React, { Component } from "react";
import { Link as ScrollLink, Element } from "react-scroll";

export default ({ versionQnasById, versionQnaIds }) => (
  <div className="d-flex flex-column sidebar-contents">
    <div className="sidebar__title-container">
      <p className="sidebar__title">Table of Contents</p>
    </div>
    {versionQnaIds.map(id => (
      <ScrollLink
        key={`table-of-content__scrolllink-${id}`}
        className={
          versionQnasById[id].isDividerTitle
            ? "table-of-content__item table-of-content__divider-title"
            : "table-of-content__item table-of-content__section-title"
        }
        activeClass="active"
        to={`qna-${id}`}
        smooth="easeInOutCubic"
        duration={300}
        spy={true}
      >
        {versionQnasById[id].markdown.replace("### ", "")}
      </ScrollLink>
    ))}
  </div>
);
