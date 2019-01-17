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
  <Fragment>
    <ListItemBase
      key={cid || vote.id}
      icon="thumbs-up"
      subtitleElements={[
        <Fragment>
          <Link className="text-primary" to={`/profile/@${userHandle}`}>
            @{userHandle}
          </Link>
          <span>upvoted a comment in</span>
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
    <ListItemAttached
      verticalDivider={true}
      quote={vote.quote}
      text={vote.comment}
      onClick={() =>
        history.push(
          `/s/${vote.slug}/comment/${vote.root_comment_id || vote.comment_id}`
        )
      }
      actionElements={
        <Fragment>
          <ContributionActionBtn
            icon="reply"
            stat={Number(vote.num_comments) || 0}
            label="replies"
          />
        </Fragment>
      }
    />
  </Fragment>
);
