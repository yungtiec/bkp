import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
import moment from "moment";

const Comments = ({
  gridClassnames,
  commentsById,
  commentIds,
  offset,
  endOfResult,
  profile,
  fetchUserComments
}) => {
  return (
    <div className={`${gridClassnames}`}>
      {commentIds.map(id => (
        <ListItem
          cardKey={id}
          cardHref=""
          mainTitle={commentsById[id].comment}
          quote={commentsById[id].quote}
          textUpperRight={moment(commentsById[id].createdAt).fromNow()}
          mainText={""}
          tagArray={[
            `replies (${commentsById[id].num_comments || 0})`,
            `upvotes (${commentsById[id].num_upvotes || 0})`
          ]}
        />
      ))}
      {!(offset === 0 && endOfResult) && (
        <div className="my-3">
          <button
            className="btn btn-outline-primary mr-2"
            disabled={offset === 0}
            onClick={() => fetchUserComments(profile.user_handle, -1)}
          >
            back
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={endOfResult}
            onClick={() => fetchUserComments(profile.user_handle, 1)}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(Comments);
