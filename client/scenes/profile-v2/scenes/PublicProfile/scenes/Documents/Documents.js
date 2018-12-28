import React, { Component, Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
import { ListItemBase, ContributionActionBtn } from "../../components";
import moment from "moment";

const Documents = ({
  gridClassnames,
  documentsById,
  documentIds,
  offset,
  endOfResult,
  profile,
  fetchUserDocuments
}) => {
  return (
    <div className={`${gridClassnames}`}>
      {documentIds.map(id => (
        <ListItemBase
          key={id}
          icon="file"
          titleElement={<a>{documentsById[id].title}</a>}
          subtitleElements={[
            <Fragment>
              <span>Posted by</span>
              <a className="text-primary">@{profile.user_handle}</a>
              <span>{moment(documentsById[id].createdAt).fromNow()}</span>
            </Fragment>
          ]}
          actionElements={
            <Fragment>
              <ContributionActionBtn
                icon="thumbs-up"
                stat={documentsById[id].num_upvotes || 0}
                label=""
              />
              <ContributionActionBtn
                icon="thumbs-down"
                stat={documentsById[id].num_downvotes || 0}
                label=""
              />
              <ContributionActionBtn
                icon="comment"
                stat={documentsById[id].num_comments || 0}
                label="comments"
              />
            </Fragment>
          }
        />
      ))}
      {!(offset === 0 && endOfResult) && (
        <div className="my-3">
          <button
            className="btn btn-outline-primary mr-2"
            disabled={offset === 0}
            onClick={() => fetchUserDocuments(profile.user_handle, -1)}
          >
            back
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={endOfResult}
            onClick={() => fetchUserDocuments(profile.user_handle, 1)}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(Documents);
