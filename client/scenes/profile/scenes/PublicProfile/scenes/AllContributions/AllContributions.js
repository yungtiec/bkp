import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn,
  CommentCard,
  DocumentCard,
  DocumentVoteCard,
  CommentVoteCard
} from "../../components";
import moment from "moment";

const AllContribution = ({
  gridClassnames,
  contributionsById,
  contributionIds,
  offset,
  endOfResult,
  profile,
  fetchUserContributions
}) => {
  return (
    <div className={`${gridClassnames}`}>
      {contributionIds.map(cid => {
        switch (contributionsById[cid].type) {
          case "comment":
            return (
              <CommentCard
                cid={cid}
                comment={contributionsById[cid]}
                userHandle={profile.user_handle}
              />
            );
          case "document":
            return <DocumentCard cid={cid} document={contributionsById[cid]} />;
          case "upvoteDocument":
          case "downvoteDocument":
            return (
              <DocumentVoteCard
                cid={cid}
                vote={contributionsById[cid]}
                userHandle={profile.user_handle}
              />
            );
          case "upvoteComment":
            return (
              <CommentVoteCard
                cid={cid}
                vote={contributionsById[cid]}
                userHandle={profile.user_handle}
              />
            );
        }
      })}
      {!(offset === 0 && endOfResult) && (
        <div className="my-3">
          <button
            className="btn btn-outline-primary mr-2"
            disabled={offset === 0}
            onClick={() => fetchUserContributions(profile.user_handle, -1)}
          >
            back
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={endOfResult}
            onClick={() => fetchUserContributions(profile.user_handle, 1)}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(AllContribution);
