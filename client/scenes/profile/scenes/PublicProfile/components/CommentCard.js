import React, { Fragment } from "react";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
} from "../components";
import { Link } from "react-router-dom";
import moment from "moment";
import history from "../../../../../history";

export default ({ cid, comment, userHandle }) => (
  <Fragment>
    <ListItemBase
      key={cid || comment.id}
      icon="comment"
      subtitleElements={[
        <Fragment>
          <Link className="text-primary" to={`/profile/@${userHandle}`}>
            @{userHandle}
          </Link>
          <span>commented on</span>
          <Link className="text-dark" to={`/s/${comment.slug}`}>
            {comment.title}
          </Link>
        </Fragment>,
        <Fragment>
          <span>Posted by</span>
          <Link
            className="text-primary"
            to={`/profile/@${comment.documentPostedBy}`}
          >
            @{comment.documentPostedBy}
          </Link>
          <span>{moment(comment.createdAt).fromNow()}</span>
        </Fragment>
      ]}
    />
    <ListItemAttached
      verticalDivider={true}
      quote={comment.quote}
      text={comment.comment}
      onClick={() =>
        history.push(
          `/s/${comment.slug}/comment/${comment.root_comment_id ||
            comment.comment_id}`
        )
      }
      actionElements={
        <Fragment>
          <ContributionActionBtn
            icon="reply"
            stat={Number(comment.num_comments) || 0}
            label="replies"
          />
        </Fragment>
      }
    />
  </Fragment>
);
