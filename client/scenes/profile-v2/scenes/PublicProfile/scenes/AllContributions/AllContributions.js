import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
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
              <ListItem
                cardKey={cid}
                cardHref=""
                mainTitle={contributionsById[cid].comment}
                quote={contributionsById[cid].quote}
                subtitle={""}
                textUpperRight={moment(
                  contributionsById[cid].createdAt
                ).fromNow()}
                mainText={""}
                tagArray={[
                  `comments (${Number(contributionsById[cid].num_comments) ||
                    0})`,
                  `upvotes (${contributionsById[cid].num_upvotes || 0})`
                ]}
              />
            );
          case "document":
            return (
              <ListItem
                cardKey={cid}
                cardHref=""
                mainTitle={contributionsById[cid].title}
                subtitle={""}
                textUpperRight={moment(
                  contributionsById[cid].createdAt
                ).fromNow()}
                mainText={""}
                tagArray={[
                  `comments (${contributionsById[cid].num_comments || 0})`,
                  `upvotes (${contributionsById[cid].num_upvotes || 0})`,
                  `downvotes (${contributionsById[cid].num_downvotes || 0})`
                ]}
              />
            );
          case "upvote":
            return (
              <ListItem
                cardKey={cid}
                cardHref=""
                mainTitle={`upvoted ${contributionsById[cid].title}`}
                subtitle={""}
                textUpperRight={moment(
                  contributionsById[cid].createdAt
                ).fromNow()}
                mainText={""}
              />
            );
          case "downvote":
            return (
              <ListItem
                cardKey={cid}
                cardHref=""
                mainTitle={`downvoted ${contributionsById[cid].title}`}
                subtitle={""}
                textUpperRight={moment(
                  contributionsById[cid].createdAt
                ).fromNow()}
                mainText={""}
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
