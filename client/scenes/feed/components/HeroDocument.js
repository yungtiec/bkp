import React, { Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";

export default ({ document }) => {
  return (
    <Fragment>
      <div className="feed__feature-article-title">{document.title}</div>
      <div className="feed__feature-article-content ml-3">
        {document.index_description
          ? ReactHtmlParser(document.index_description).filter(
              elem => elem.type === "p"
            )[0]
          : ReactHtmlParser(document.content_html).filter(
              elem => elem.type === "p"
            )[0]}
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
