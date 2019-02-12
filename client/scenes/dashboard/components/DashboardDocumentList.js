import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { maxBy } from "lodash";

export default ({
  documentIds,
  documentsById,
  fetchDocumentsWithStats,
  additionalDocumentsLoading,
  allDocumentsFetched
}) => {
  console.log(allDocumentsFetched)
  return (
    <div className="d-flex flex-column">
      <p className="dashboard-listing__title mb-2 pb-2 pl-1">All Documents</p>
      {documentIds && documentIds.length ? (
        <Fragment>
          {documentIds.map(id => (
            <div
              key={`dashboard-document-listing__${id}`}
              className="dashboard-listing__item py-2 pl-1"
            >
              <Link
                to={`/s/${documentsById[id].slug}`}
                className="d-flex align-items-start"
              >
                {documentsById[id].title}
              </Link>
            </div>
          ))}
          {allDocumentsFetched ? null : (
            <a
              className="dashboard-listing__item py-2 pl-1 text-primary"
              onClick={() => fetchDocumentsWithStats(true)}
            >
              {additionalDocumentsLoading ? "loading" : "show more"}
            </a>
          )}
        </Fragment>
      ) : (
        <div>currently has no document available</div>
      )}
    </div>
  );
};
