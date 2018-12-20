import React, { Component } from "react";
import autoBind from "react-autobind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { notify } from "reapop";
import { connect } from "react-redux";
import download from "downloadjs";
import { Link } from "react-router-dom";
import history from "../../../history";
import { orderBy, find, isEmpty, maxBy } from "lodash";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import { loadModal } from "../../../data/reducer";
import policies from "../../../policies.js";
import ReactTooltip from "react-tooltip";

class VersionToolbar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const {
      documentMetadata,
      uploadMode,
      user,
      upvoteDocument,
      downvoteDocument
    } = this.props;

    const document = documentMetadata;

    const hasUpvoted = !!find(
      documentMetadata.upvotesFrom,
      upvotedUser => upvotedUser.id === user.id
    );

    const hasDownvoted = !!find(
      documentMetadata.downvotesFrom,
      downvotedUser => downvotedUser.id === user.id
    );

    return (
      <div>
        <div className="btn-group mb-3" role="group" aria-label="Basic example">
          <button
            type="button"
            className={`btn ${
              hasUpvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            } project-document__upvote-btn`}
            onClick={() =>
              upvoteDocument({
                projectSymbol: documentMetadata.project.symbol,
                documentId: documentMetadata.id,
                versionId: document.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-up mr-2" />
            {documentMetadata.upvotesFrom
              ? documentMetadata.upvotesFrom.length
              : 0}
          </button>
          <button
            type="button"
            className={`btn ${
              hasDownvoted
                ? "bg-consensys text-light"
                : "text-consensys btn-outline-primary"
            }`}
            onClick={() =>
              downvoteDocument({
                projectSymbol: documentMetadata.project.symbol,
                documentId: documentMetadata.id,
                versionId: document.id,
                hasUpvoted,
                hasDownvoted
              })
            }
          >
            <i className="fas fa-thumbs-down mr-2" />
            {documentMetadata.downvotesFrom
              ? documentMetadata.downvotesFrom.length
              : 0}
          </button>
          {document.pdf_link ? (
            <button type="button" className="btn btn-outline-primary">
              <a
                href={
                  document.pdf_link
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                View pdf
              </a>
            </button>
          ) : null}
          <PunditContainer policies={policies} user={user}>
            <PunditTypeSet type="Disclosure">
              <VisibleIf
                action="Version"
                model={{
                  project: documentMetadata.project,
                  disclosure: documentMetadata
                }}
              >
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    id="versionProgressButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <Link
                      to={`/s/${document.slug}/progress`}
                    >
                      View progress
                    </Link>
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="versionProgressButton"
                  >
                    <Link
                      to={`/s/${document.slug}/progress`}
                      class="dropdown-item"
                    >
                      Milestone
                    </Link>
                    <Link
                      to={`/s/${document.slug}/issues`}
                      class="dropdown-item"
                    >
                      Issues
                    </Link>
                  </div>
                </div>
              </VisibleIf>
            </PunditTypeSet>
          </PunditContainer>
          {!uploadMode ? (
            <PunditContainer policies={policies} user={user}>
              <PunditTypeSet type="Disclosure">
                <VisibleIf
                  action="Version"
                  model={{
                    project: documentMetadata.project.symbol,
                    disclosure: documentMetadata
                  }}
                >
                  <button type="button" className="btn btn-outline-primary">
                    <Link
                      to={`/s/${document.slug}/upload`}
                    >
                      Import new version
                    </Link>
                  </button>
                </VisibleIf>
              </PunditTypeSet>
            </PunditContainer>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  width: state.data.environment.width
});

export default connect(mapState, { notify, loadModal })(VersionToolbar);
