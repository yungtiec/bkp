import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn,
  CommentCard
} from "../../components";
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
        <CommentCard
          comment={commentsById[id]}
          userHandle={profile.user_handle}
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
