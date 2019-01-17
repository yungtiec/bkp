import React, { Fragment } from "react";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
} from "../components";
import { Link } from "react-router-dom";
import moment from "moment";
import history from "../../../../../history";

export default ({ cid, document }) => (
  <ListItemBase
    key={cid || document.id}
    icon="file"
    titleElement={<a>{document.title}</a>}
    onClick={() => history.push(`/s/${document.slug}`)}
    subtitleElements={[
      <Fragment>
        <span>Posted by</span>
        <Link
          className="text-primary"
          to={`/profile/@${document.documentPostedBy}`}
        >
          @{document.documentPostedBy}
        </Link>
        <span>{moment(document.createdAt).fromNow()}</span>
      </Fragment>
    ]}
    actionElements={
      <Fragment>
        <ContributionActionBtn
          icon="thumbs-up"
          stat={Number(document.num_upvotes) || 0}
          label=""
        />
        <ContributionActionBtn
          icon="thumbs-down"
          stat={Number(document.num_downvotes) || 0}
          label=""
        />
        <ContributionActionBtn
          icon="comment"
          stat={Number(document.num_comments) || 0}
          label="comments"
        />
      </Fragment>
    }
  />
);
