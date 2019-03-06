import { Link } from "react-router-dom";
import "./ProjectAuthorName.scss";
import React from "react";
import moment from "moment";

export default ({ name, userHandle, delegate, createdAt }) => (
  <p className="project-author__header">
    By{" "}
    <Link to={`/profile/@${userHandle}`}>
      {name}
      {delegate ? " (Reposted By BKP Admin)" : ""} |
    </Link>
    <span className="project-published-date__header">
      Published {moment(createdAt).format("MM.DD.YYYY")}
    </span>
  </p>
);
