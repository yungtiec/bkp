import React from "react";
import moment from "moement";

// figure out extracting exercpt

export default ({ document }) => (
  <div className="document-preview__bloc d-flex align-items-stretch mb-3">
    <div className="document-preview__img-wrapper">
      <a />
    </div>
    <div className="document-preview__content ml-4">
      <h6>{document.category.replace("-", " ")}</h6>
      <h5>{document.title}</h5>
      <p>
        The questions below were originally posted by the CFTC in their “Request
        For Input On Crypto-Asset Mechanics And Markets” on 11 December 2018,
        available at
        https://www.cftc.gov/sites/default/files/2018-12/federalregister121118.pdf.
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
            <span>{Number(document.num_comments) || 0}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);
