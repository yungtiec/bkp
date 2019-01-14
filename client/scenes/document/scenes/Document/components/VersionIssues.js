import React, { Component } from "react";
import moment from "moment";
import { seeCommentContext } from "../../../../../utils";
import { assignIn } from "lodash";

export default ({ documentMetadata }) => {
  const document = documentMetadata.versions[0];
  const projectSymbol = documentMetadata.project.symbol;
  const commentsWithIssue = document.comments.filter(
    comment => comment.issue && comment.issue.open
  );

  return (
    <div className="project-document" id="project-document">
      <div key={`document-issues__version-${document.version_number}`}>
        <p>
          Version {document.version_number} - {documentMetadata.title}
        </p>
        {commentsWithIssue.filter(c => c.reviewed !== "spam").length ? (
          <div className="entity-cards mb-4">
            {commentsWithIssue.filter(c => c.reviewed !== "spam").map(c => (
              <div
                key={`outstanding-issue__${c.issue.id}`}
                className="entity-card p-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  seeCommentContext(
                    assignIn(
                      {
                        version: {
                          id: document.id,
                          document: {
                            id: document.document.id,
                            project: {
                              symbol: projectSymbol
                            }
                          }
                        }
                      },
                      c
                    )
                  )
                }
              >
                {c.quote ? (
                  <div
                    style={{ borderLeft: "3px solid grey" }}
                    className="pl-3 mb-2"
                  >
                    {c.quote}
                  </div>
                ) : null}
                <div>{c.comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No outstanding issue</p>
        )}
      </div>
    </div>
  );
};
