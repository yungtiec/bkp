import React, { Component, Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
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
              <Fragment>
                <ListItemBase
                  key={cid}
                  icon="comment"
                  subtitleElements={[
                    <Fragment>
                      <a className="text-primary">@{profile.user_handle}</a>
                      <span>commented on</span>
                      <a className="text-dark">
                        {contributionsById[cid].title}
                      </a>
                    </Fragment>,
                    <Fragment>
                      <span>Posted by</span>
                      <a className="text-primary">
                        @{contributionsById[cid].documentPostedBy}
                      </a>
                      <span>
                        {moment(contributionsById[cid].createdAt).fromNow()}
                      </span>
                    </Fragment>
                  ]}
                />
                <ListItemAttached
                  verticalDivider={true}
                  quote={contributionsById[cid].quote}
                  text={contributionsById[cid].comment}
                  actionElements={
                    <Fragment>
                      <ContributionActionBtn
                        icon="reply"
                        stat={Number(contributionsById[cid].num_comments) || 0}
                        label="replies"
                      />
                    </Fragment>
                  }
                />
              </Fragment>
            );
          case "document":
            return (
              <ListItemBase
                key={cid}
                icon="file"
                titleElement={<a>{contributionsById[cid].title}</a>}
                subtitleElements={[
                  <Fragment>
                    <span>Posted by</span>
                    <a className="text-primary">
                      @{contributionsById[cid].documentPostedBy}
                    </a>
                    <span>
                      {moment(contributionsById[cid].createdAt).fromNow()}
                    </span>
                  </Fragment>
                ]}
                actionElements={
                  <Fragment>
                    <ContributionActionBtn
                      icon="thumbs-up"
                      stat={Number(contributionsById[cid].num_upvotes) || 0}
                      label=""
                    />
                    <ContributionActionBtn
                      icon="thumbs-down"
                      stat={Number(contributionsById[cid].num_downvotes) || 0}
                      label=""
                    />
                    <ContributionActionBtn
                      icon="comment"
                      stat={Number(contributionsById[cid].num_comments) || 0}
                      label="comments"
                    />
                  </Fragment>
                }
              />
            );
          case "upvote":
          case "downvote":
            return (
              <ListItemBase
                key={cid}
                icon={`thumbs-${
                  contributionsById[cid].type === "upvote" ? "up" : "down"
                }`}
                subtitleElements={[
                  <Fragment>
                    <a className="text-primary">@{profile.user_handle}</a>
                    <span>{contributionsById[cid].type}d</span>
                    <a className="text-dark">{contributionsById[cid].title}</a>
                  </Fragment>,
                  <Fragment>
                    <span>Posted by</span>
                    <a className="text-primary">
                      @{contributionsById[cid].documentPostedBy}
                    </a>
                    <span>
                      {moment(contributionsById[cid].createdAt).fromNow()}
                    </span>
                  </Fragment>
                ]}
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
