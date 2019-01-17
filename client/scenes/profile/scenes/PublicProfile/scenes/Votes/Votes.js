import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { DocumentVoteCard, CommentVoteCard } from "../../components";
import moment from "moment";

const Votes = ({
  gridClassnames,
  votesById,
  voteIds,
  offset,
  endOfResult,
  profile,
  fetchUserVotes
}) => {
  return (
    <div className={`${gridClassnames}`}>
      {voteIds.map(cid => {
        var mainTitle;
        switch (votesById[cid].type) {
          case "upvoteDocument":
          case "downvoteDocument":
            return (
              <DocumentVoteCard
                cid={cid}
                vote={votesById[cid]}
                userHandle={profile.user_handle}
              />
            );
          case "upvoteComment":
            return (
              <CommentVoteCard
                cid={cid}
                vote={votesById[cid]}
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
            onClick={() => fetchUserVotes(profile.user_handle, -1)}
          >
            back
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={endOfResult}
            onClick={() => fetchUserVotes(profile.user_handle, 1)}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(Votes);
