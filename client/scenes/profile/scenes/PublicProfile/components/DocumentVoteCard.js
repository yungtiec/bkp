import React, { Fragment } from "react";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
} from "../components";
import { Link } from "react-router-dom";
import moment from "moment";
import history from "../../../../../history";


export default ({ cid, vote, userHandle }) => (
  <ListItemBase
    key={cid || vote.id}
    icon={`thumbs-${vote.type === "upvoteDocument" ? "up" : "down"}`}
    onClick={() => history.push(`/s/${vote.slug}`)}
    subtitleElements={[
      <Fragment>
        <Link className="text-primary" to={`/profile/@${userHandle}`}>
          @{userHandle}
        </Link>
        <span>
          {vote.type === "upvoteDocument" ? "upvote" : "downvote"}d
        </span>
        <Link className="text-dark" to={`/s/${vote.slug}`}>
          {vote.title}
        </Link>
      </Fragment>,
      <Fragment>
        <span>Posted by</span>
        <Link
          className="text-primary"
          to={`/profile/@${vote.documentPostedBy}`}
        >
          @{vote.documentPostedBy}
        </Link>
        <span>{moment(vote.createdAt).fromNow()}</span>
      </Fragment>
    ]}
  />
);
