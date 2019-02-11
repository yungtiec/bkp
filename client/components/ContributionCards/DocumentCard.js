import React, { Fragment } from "react";
import { ListItemBase, ListItemAttached } from "./ListComponents";
import ContributionActionBtn from "./ContributionActionBtn";
import { Link } from "react-router-dom";
import moment from "moment";
import history from "../../history";

const goToDocument = (e, document) => {
  if (e.target.className.indexOf("document-card__profile-link") !== -1) return;
  history.push(`/s/${document.slug}`);
};

export default ({ cid, document }) => (
  <ListItemBase
    key={cid || document.id}
    icon="file"
    titleElement={<a>{document.title}</a>}
    onClick={e => goToDocument(e, document)}
    subtitleElements={[
      <Fragment>
        <span>Posted by</span>
        <Link
          className="text-primary document-card__profile-link"
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
