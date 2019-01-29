import "./SidebarTableOfContents.scss";
import React, { Component } from "react";
import { Link as ScrollLink, Element } from "react-scroll";
import $ from "jquery";

const goToEntryInTableOfContent = heading => {
  var offset = $(heading).offset();
  offset &&
    $("html, body").animate(
      {
        scrollTop: offset.top
      },
      200
    );
};

export default ({ versionQnasById, versionQnaIds }) => {
  const headings = $(".markdown-body h1, .markdown-body h2,.markdown-body h3");

  return headings.length ? (
    <div className="d-flex flex-column sidebar-contents">
      <div className="sidebar__title-container">
        <p className="sidebar__title">Table of Contents</p>
      </div>
      {$.map(headings, heading => {
        return (
          <div
            className={"table-of-content__item table-of-content__section-title"}
            onClick={() => goToEntryInTableOfContent(heading)}
          >
            <a>{heading.innerText}</a>
          </div>
        );
      })}
    </div>
  ) : null;
};
