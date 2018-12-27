import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
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
        <ListItem
          cardKey={id}
          cardHref=""
          mainTitle={documentsById[id].title}
          subtitle={""}
          textUpperRight={moment(documentsById[id].createdAt).fromNow()}
          mainText={""}
          tagArray={[
            `comments (${documentsById[id].num_comments || 0})`,
            `upvotes (${documentsById[id].num_upvotes || 0})`,
            `downvotes (${documentsById[id].num_downvotes || 0})`
          ]}
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
