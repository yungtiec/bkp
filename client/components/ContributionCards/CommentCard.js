import React, { Fragment } from "react";
import { ListItemBase, ListItemAttached } from "./ListComponents";
import ContributionActionBtn from "./ContributionActionBtn";
import { Link } from "react-router-dom";
import moment from "moment";
import history from "../../history";

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
          <Link
            className="text-dark"
            to={`/s/${comment.slug || comment.document.slug}`}
          >
            {comment.title || comment.document.title}
          </Link>
        </Fragment>,
        <Fragment>
          <span>Posted by</span>
          <Link
            className="text-primary"
            to={`/profile/@${comment.documentPostedBy ||
              (comment.document && comment.document.creator.user_handle)}`}
          >
            @
            {comment.documentPostedBy ||
              (comment.document && comment.document.creator.user_handle)}
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
          `/s/${comment.slug ||
            comment.document.slug}/comment/${comment.root_comment_id ||
            comment.comment_id ||
            comment.id}`
        )
      }
      actionElements={
        <Fragment>
          <ContributionActionBtn
            icon="reply"
            stat={
              Number(comment.num_comments) ||
              (comment.descendents && comment.descendents.length) ||
              0
            }
            label="replies"
          />
        </Fragment>
      }
    />
  </Fragment>
);
