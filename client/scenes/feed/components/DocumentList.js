import React, { Fragment } from "react";
import DocumentPreviewBlock from "./DocumentPreviewBlock";

export default ({
  documentIds,
  documentsById,
  fetchFilteredDocumentsWithStats,
  endOfResult
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
          Load more
        </button>
      ) : null}
    </div>
  </Fragment>
);
