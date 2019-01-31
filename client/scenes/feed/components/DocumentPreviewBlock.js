import React from "react";
import moment from "moment";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";

// figure out extracting exercpt

export default ({ document }) => (
  <Link
    className="document-preview__bloc d-flex align-items-stretch mb-5"
    to={`/s/${document.slug}`}
  >
    <div className="document-preview__img-wrapper">
      <a
        style={{
          backgroundColor: "#bde0f9",
          backgroundImage: `url(${document.header_img_url ||
            "https://images.unsplash.com/photo-1547559418-8d7437f53b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"})`
        }}
      />
    </div>
    <div className="document-preview__content ml-4">
      <h6>{document.category.replace(/-/g, " ")}</h6>
      <h5>{document.title}</h5>
      <p>
        {
          ReactHtmlParser(document.content_html).filter(
            elem => elem.type === "p"
          )[0]
        }
      </p>
      <div className="document-preview__content-bottom d-flex justify-content-between align-items-center">
        <span>{moment(document.createdAt).fromNow()}</span>
        <div>
          <a className="contribution__action-btn">
            <i className="fas fa-thumbs-up" />
            <span>{Number(document.num_upvotes) || 0}</span>
          </a>
          <a className="contribution__action-btn">
            <i className="fas fa-thumbs-down" />
            <span>{Number(document.num_downvotes) || 0}</span>
          </a>
          <a className="contribution__action-btn">
            <i className="fas fa-comment" />
            <span>{Number(document.num_total_comments) || 0}</span>
          </a>
        </div>
      </div>
    </div>
  </Link>
);
