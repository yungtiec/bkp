import React, { Component, Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { DocumentCard } from "../../../../../../components";

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
        <DocumentCard document={documentsById[id]} />
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
