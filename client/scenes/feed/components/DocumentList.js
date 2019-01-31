import React, { Fragment } from "react";
import DocumentPreviewBlock from "./DocumentPreviewBlock";

export default ({
  documentIds,
  documentsById,
  fetchFilteredDocumentsWithStats,
  endOfResult,
  additionalDocumentsLoading
}) => (
  <Fragment>
    {documentIds.map(id => (
      <DocumentPreviewBlock document={documentsById[id]} />
    ))}
    <div className="text-center mb-5">
      {!endOfResult ? (
        <button
          className="btn btn-primary"
          onClick={fetchFilteredDocumentsWithStats}
        >
          {additionalDocumentsLoading ? "Loading" : "Load more"}
        </button>
      ) : null}
    </div>
  </Fragment>
);
