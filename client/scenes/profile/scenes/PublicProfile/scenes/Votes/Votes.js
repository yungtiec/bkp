import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
} from "../../components";
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
              <ListItemBase
                key={cid}
                icon={`thumbs-${
                  votesById[cid].type === "upvoteDocument" ? "up" : "down"
                }`}
                subtitleElements={[
                  <Fragment>
                    <a className="text-primary">@{profile.user_handle}</a>
                    <span>
                      {votesById[cid].type === "upvoteDocument"
                        ? "upvote"
                        : "downvote"}d
                    </span>
                    <a className="text-dark">{votesById[cid].title}</a>
                  </Fragment>,
                  <Fragment>
                    <span>Posted by</span>
                    <a className="text-primary">
                      @{votesById[cid].documentPostedBy}
                    </a>
                    <span>{moment(votesById[cid].createdAt).fromNow()}</span>
                  </Fragment>
                ]}
              />
            );
          case "upvoteComment":
            return (
              <Fragment>
                <ListItemBase
                  key={cid}
                  icon="thumbs-up"
                  subtitleElements={[
                    <Fragment>
                      <a className="text-primary">@{profile.user_handle}</a>
                      <span>upvoted a comment in</span>
                      <a className="text-dark">{votesById[cid].title}</a>
                    </Fragment>,
                    <Fragment>
                      <span>Posted by</span>
                      <a className="text-primary">
                        @{votesById[cid].documentPostedBy}
                      </a>
                      <span>{moment(votesById[cid].createdAt).fromNow()}</span>
                    </Fragment>
                  ]}
                />
                <ListItemAttached
                  verticalDivider={true}
                  quote={votesById[cid].quote}
                  text={votesById[cid].comment}
                  actionElements={
                    <Fragment>
                      <ContributionActionBtn
                        icon="reply"
                        stat={Number(votesById[cid].num_comments) || 0}
                        label="replies"
                      />
                    </Fragment>
                  }
                />
              </Fragment>
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
