import "./FeedItem.scss";
import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

export default ({
  linkUrl,
  imgUrl,
  category,
  title,
  description,
  tags,
  date,
  creatorName,
  numUpvotes,
  numDownvotes,
  numComments
}) => {
  imgUrl =
    imgUrl && imgUrl.includes("unsplash")
      ? imgUrl.concat("&auto=format&fit=crop&w=800&q=80")
      : imgUrl;
  const backgroundImage = `url(${imgUrl ||
    "https://images.unsplash.com/photo-1547559418-8d7437f53b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}`;

  return (
    <Link
      className="feed-item__bloc d-flex align-items-stretch mb-5"
      to={linkUrl}
    >
      {imgUrl ? (
        <div className="feed-item__img-wrapper mr-4">
          <a
            style={{
              backgroundColor: "#bde0f9",
              backgroundImage: `url(${imgUrl ||
                "https://images.unsplash.com/photo-1547559418-8d7437f53b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}&auto=format&fit=crop&w=800&q=80)`
            }}
          />
        </div>
      ) : null}
      <div className="feed-item__content">
        {category ? <h6>{category}</h6> : null}
        <h5>{title}</h5>
        <span className="feed-item__author-name d-flex mb-2">By {creatorName}</span>
        {/*{tags && tags.length ? (*/}
          {/*<div className="mb-2">*/}
            {/*<span style={{ fontSize: "12px" }}>Tags: </span>*/}
            {/*{tags.map(tag => (*/}
              {/*<span key={`tag-${tag.name}`} className="badge badge-light">*/}
                {/*{tag.name}*/}
                {/*{"  "}*/}
              {/*</span>*/}
            {/*))}*/}
          {/*</div>*/}
        {/*) : (*/}
          {/*""*/}
        {/*)}*/}
        <div>{description}</div>
        <div className="feed-item__content-bottom d-flex justify-content-between align-items-center">
          <span>
            {date}
          </span>
          <div>
            <a className="contribution__action-btn">
              <i className="fas fa-thumbs-up" />
              <span>{numUpvotes || 0}</span>
            </a>
            <a className="contribution__action-btn">
              <i className="fas fa-thumbs-down" />
              <span>{numDownvotes || 0}</span>
            </a>
            <a className="contribution__action-btn">
              <i className="fas fa-comment" />
              <span>{numComments || 0}</span>
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
};
