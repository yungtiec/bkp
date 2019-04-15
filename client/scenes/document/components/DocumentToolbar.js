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
import { currentUserIsAdmin } from '../../../data/user/reducer';

class DocumentToolbar extends Component {
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
      downvoteDocument,
      displayEditor,
      isLoggedIn,
      hideEditor,
      showEditor,
      userId,
      isUserAdmin,
      toggleSidebar,
      sidebarOpen,
      toggleSidebarContext,
      sidebarContext
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

    const isOwnDocument = userId === documentMetadata.creator_id || isUserAdmin;

    const toggleSidebarWithContext = (context) => {
      if (!sidebarOpen) {
        toggleSidebar(context)
      }
      if (sidebarOpen && (sidebarContext !== context)) {
        toggleSidebarContext()
      }
      if (sidebarOpen && (sidebarContext === context)) {
        toggleSidebar(context)
      }
    };

    return (
      <div className="mb-2">
        <div className="btn-group mb-3" role="group" aria-label="Basic example">
          <button
            type="button"
            className={`btn document-toolbar__btn ${
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
            className={`btn document-toolbar__btn ${
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
          <button
            type="button"
            className="btn document-toolbar__btn text-consensys btn-outline-primary"
            onClick={() => toggleSidebarWithContext('tableOfContents')}
          >
            <i className="fas fa-list" />
          </button>
          <button
            type="button"
            className="btn document-toolbar__btn text-consensys btn-outline-primary"
            onClick={() => toggleSidebarWithContext('comments')}
          >
            <i className="fas fa-comment mr-2" />
            {documentMetadata.comments
              ? documentMetadata.comments.length
              : 0}
          </button>
          {document.pdf_link ? (
            <button type="button" className="btn document-toolbar__btn btn-outline-primary">
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
          {!displayEditor && isLoggedIn && isOwnDocument ? (
            <button className="btn btn-outline-primary" onClick={showEditor}>
              edit
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  width: state.data.environment.width,
  isUserAdmin: currentUserIsAdmin(state)
});

export default connect(mapState, { notify, loadModal, currentUserIsAdmin })(DocumentToolbar);
