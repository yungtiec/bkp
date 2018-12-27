import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
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
      {voteIds.map(id => {
        var mainTitle;
        switch (votesById[id].type) {
          case "upvoteDocument":
            mainTitle = `upvoted ${votesById[id].title}`;
            break;
          case "downvoteDocument":
            mainTitle = `downvoted ${votesById[id].title}`;
            break;
          case "upvoteComment":
            mainTitle = `upvoted a comment`;
            break;
          default:
            mainTitle = "";
        }
        return (
          <ListItem
            cardKey={id}
            cardHref=""
            mainTitle={mainTitle}
            textUpperRight={moment(votesById[id].createdAt).fromNow()}
            mainText={""}
          />
        );
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
