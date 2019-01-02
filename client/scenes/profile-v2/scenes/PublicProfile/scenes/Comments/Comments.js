import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  ListItemBase,
  ListItemAttached,
  ContributionActionBtn
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
        <Fragment>
          <ListItemBase
            key={id}
            icon="comment"
            subtitleElements={[
              <Fragment>
                <a className="text-primary">@{profile.user_handle}</a>
                <span>commented on</span>
                <a className="text-dark">{commentsById[id].title}</a>
              </Fragment>,
              <Fragment>
                <span>Posted by</span>
                <a className="text-primary">
                  @{commentsById[id].documentPostedBy}
                </a>
                <span>{moment(commentsById[id].createdAt).fromNow()}</span>
              </Fragment>
            ]}
          />
          <ListItemAttached
            verticalDivider={true}
            quote={commentsById[id].quote}
            text={commentsById[id].comment}
            actionElements={
              <Fragment>
                <ContributionActionBtn
                  icon="reply"
                  stat={Number(commentsById[id].num_comments) || 0}
                  label="replies"
                />
              </Fragment>
            }
          />
        </Fragment>
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
