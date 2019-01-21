import React, { Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";

export default ({ document }) => {
  return (
    <Fragment>
      <div className="feed__feature-article-title">{document.title}</div>
      <div className="feed__feature-article-content ml-3">
        {ReactHtmlParser(document.content_html)
          .slice(0, 5)
          .filter(elem => elem.type === "p")}
      </div>
      <div className="feed__feature-actions">
        <Link
          className="feed__feature-action-read-more"
          to={`/s/${document.slug}`}
        >
          READ MORE
        </Link>
      </div>
    </Fragment>
  );
};
