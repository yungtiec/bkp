import "./SidebarTableOfContents.scss";
import React, { Component } from "react";
import { Link as ScrollLink, Element } from "react-scroll";

export default ({ versionQnasById, versionQnaIds }) => {
  const h3s = document.querySelectorAll("h3");
  let headings = [];

  console.log(h3s);

  h3s.forEach((h3) => {
    headings.push(h3.innerText);
  });

  console.log({headings});

  return headings.length ?
    (
      <div className="d-flex flex-column sidebar-contents">
        <div className="sidebar__title-container">
          <p className="sidebar__title">Table of Contents</p>
        </div>
        {headings.map(heading => (
          <div
            key={`table-of-content__scrolllink-${heading}`}
            className={"table-of-content__item table-of-content__section-title"}
          >
            { heading }
          </div>
        ))}
      </div>
    ) :  null;
}

{/*<ScrollLink*/}
  {/*key={`table-of-content__scrolllink-${heading}`}*/}
  {/*className={"table-of-content__item table-of-content__section-title"}*/}
  {/*activeClass="active"*/}
  {/*to={`qna-${heading}`}*/}
  {/*smooth="easeInOutCubic"*/}
  {/*duration={300}*/}
  {/*spy={true}*/}
{/*>*/}
  {/*{ heading }*/}
{/*</ScrollLink>*/}
