import React, { Component } from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import { batchActions } from "redux-batched-actions";
import { SquareLoader } from "halogenium";
import { Link, Switch, Route, matchPath } from "react-router-dom";
import { connect } from "react-redux";
import {
  DocumentContent,
  SidebarComments,
  SidebarTableOfContents
} from "./components";
import { DocumentHeader, VersionToolbar } from "../../components";
import { findCommentsInQnaByText } from "../../utils";
import { SidebarLayout, CustomScrollbar } from "../../../../components";
import Joyride from "react-joyride";
import { Conversation } from '../../../requests-for-comment/scenes/Question/components';
import { Comments } from '../../../requests-for-comment/scenes/Question/components';
import { loadModal, hideModal} from '../../../../data/modal/actions';
import {sortCommentBy} from '../../reducer';

class Document extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      run: this.props.isLoggedIn && !this.props.onboard,
      steps: [
        {
          content: (
            <div>
              <p>
                Welcome to the public comment initiative for The Brooklyn
                project's Consumer Token Framework. Your feedback is important
                to us. By leaving comments and upvoting comments you find
                helpful, you will provide a basis for a better framework. The
                public comment initiative will be closed on{"- "}
                <b>6 December 2018</b>. An updated version of the framework will
                incorporate the feedback received before the deadline and is
                scheduled to be released shortly after.
              </p>
            </div>
          ),
          placement: "center",
          disableBeacon: true,
          styles: {
            options: {
              zIndex: 10000
            }
          },
          target: "body"
        },
        {
          target: ".project-document__upvote-btn",
          content: "What do you think about the framework overall?",
          disableBeacon: true,
          placement: "top"
        },
        {
          target: "div.qna__answer p:first-of-type",
          content: "Select text from document to make an annotation.",
          disableBeacon: true,
          placement: "top"
        },
        {
          target: ".page-comment",
          content: "Tell us what you think about the framework.",
          disableBeacon: true,
          placement: "left"
        },
        {
          target: ".page-comment",
          content: (
            <div>
              Wish to comment anonymously? Change the default setting in your
              profile page.
            </div>
          ),
          disableBeacon: true,
          placement: "left"
        }
      ]
    };
  }

  componentDidMount(nextProps) {
    this.focusOnContext();
    this.props.sortCommentBy('timestamp');
  }

  componentDidUpdate(prevProps) {
    (this.props.location.pathname !== prevProps.location.pathname ||
      this.props.commentsLoading !== prevProps.commentsLoading) &&
    this.focusOnContext();

    if (this.props.location.hash !== prevProps.location.hash) {
      var sectionHash = this.props.location.hash.replace("#", "");
      var isInFooter = sectionHash.indexOf("ref") !== -1;
      var referenceHash;
      if (isInFooter) {
        referenceHash = sectionHash.replace("ref", "");
      } else {
        referenceHash = sectionHash.split("_ftn").slice(1);
        referenceHash.unshift("ref");
        referenceHash = "_ftn" + referenceHash.join("");
      }
      if (sectionHash) {
        let node = ReactDOM.findDOMNode(this[referenceHash]);
        if (node) {
          node.scrollIntoView();
        }
      }
    }
  }

  componentWillUnmount() {
    this.resetSidebarContext();
  }

  focusOnContext() {
    const matchComment = matchPath(this.props.location.pathname, {
      path: `/s/:slug/comment/:commentId`,
      exact: true,
      strict: false
    });
    if (
      matchComment &&
      matchComment.params &&
      matchComment.params.commentId &&
      this.props.commentsById &&
      this.props.commentsById[Number(matchComment.params.commentId)]
    ) {
      this.props.updateSidebarCommentContext({
        selectedCommentIds: [Number(matchComment.params.commentId)],
        focusOnce: true
      });
    }
  }

  componentWillUnmount() {
    this.props.updateSidebarCommentContext({
      selectedCommentIds: null,
      focusOnce: false
    });
  }

  resetSidebarContext() {
    this.props.updateSidebarCommentContext({
      focusOnce: false,
      selectedCommentIds: null
    });
  }

  commentOnClick(evt, qnaId, answerId) {
    const selectedTextByUser = window.getSelection
      ? "" + window.getSelection()
      : document.selection.createRange().text;
    if (selectedTextByUser) return;
    if (!qnaId && !answerId) return;
    const selectedText = evt.target.innerHTML;
    const comments = findCommentsInQnaByText({
      commentIds: this.props.unfilteredCommentIds,
      commentsById: this.props.commentsById,
      text: selectedText,
      qnaId
    });
    if (!this.props.sidebarOpen && comments && comments.length) {
      this.props.toggleSidebar();
    }
    if (comments && comments.length) {
      this.props.updateSidebarCommentContext({
        focusQnaId: qnaId,
        selectedText,
        focusOnce: true
      });
    }
  }

  getSelectedComments() {
    const {
            sidebarCommentContext,
            unfilteredCommentIds,
            commentsById
          } = this.props;
    if (sidebarCommentContext.selectedText)
      return findCommentsInQnaByText({
        commentIds: unfilteredCommentIds,
        commentsById: commentsById,
        text: sidebarCommentContext.selectedText,
        qnaId: sidebarCommentContext.focusQnaId
      });
    else if (
      sidebarCommentContext.selectedCommentIds &&
      sidebarCommentContext.selectedCommentIds.length
    )
      return sidebarCommentContext.selectedCommentIds.map(
        sid => commentsById[sid]
      );
    else return [];
  }

  resetSidebarCommentContext() {
    this.props.updateSidebarCommentContext({
      selectedCommentIds: ""
    });
  }

  handleJoyrideCallback(data) {
    if (data.status === "finished") {
      this.props.updateOnboardStatus();
    }
  }

  render() {
    const {
            versionMetadataLoading,
            versionQnasLoading,
            commentsLoading,
            documentMetadata,
            versionMetadata,
            commentsById,
            commentIds,
            nonSpamCommentIds,
            unfilteredCommentIds,
            isLoggedIn,
            isAdmin,
            anonymity,
            isClosedForComment,
            match,
            width,
            commentSortBy,
            sortCommentBy,
            tags,
            tagsWithCountInDocument,
            tagFilter,
            updateTagFilter,
            addNewCommentSentFromServer,
            sidebarCommentContext,
            commentIssueFilter,
            updateIssueFilter,
            addNewComment,
            sidebarOpen,
            sidebarContext,
            annotationHighlight,
            toggleSidebar,
            toggleSidebarContext,
            upvoteDocument,
            downvoteDocument,
            loadModal,
            hideModal,
            displayEditor,
            showEditor,
            hideEditor,
            me,
            replyToComment,
            upvoteComment,
            editComment,
            notify
          } = this.props;

    const selectedComments = this.getSelectedComments();

    if (!commentIds || commentsLoading)
      return (
        <SquareLoader
          key="LoadableVersion"
          className="route__loader"
          color="#2d4dd1"
          size="16px"
          margin="4px"
        />
      );
    else
      return (
        <div>
          <Joyride
            continuous
            showProgress
            steps={this.state.steps}
            run={this.state.run}
            callback={this.handleJoyrideCallback}
            styles={{
              options: {
                primaryColor: "#2540ce"
              }
            }}
          />
          <DocumentContent
            parent={this}
            isAdmin={isAdmin}
            location={location}
            isLoggedIn={isLoggedIn}
            isClosedForComment={isClosedForComment}
            documentMetadata={documentMetadata}
            tags={tags}
            tagFilter={tagFilter}
            commentOnClick={this.commentOnClick}
            addNewCommentSentFromServer={addNewCommentSentFromServer}
            displayEditor={displayEditor}
            showEditor={showEditor}
            hideEditor={hideEditor}
          />
          <Conversation me={me} addNewComment={addNewComment} id={documentMetadata.id}/>
          <Comments
            commentIds={commentIds}
            commentsById={commentsById}
            me={me}
            replyToComment={replyToComment}
            upvoteComment={upvoteComment}
            editComment={editComment}
            slug={match.params.slug}
            notify={notify}
            loadModal={loadModal}
            hideModal={hideModal}
          />
          <div className="d-flex project-document__footer">
            <a
              href="https://tinyurl.com/y94wspyg"
              target="_blank"
              className="mr-4 mb-3"
            >
              <span className="text-secondary">privacy policy</span>
            </a>
            <a
              href="https://drive.google.com/open?id=1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV"
              target="_blank"
              className="mr-4 mb-3"
            >
              <span className="text-secondary">terms of use</span>
            </a>
            <a className="mb-3" onClick={() => loadModal("FEEDBACK_MODAL")}>
              <span className="text-secondary">
                report bugs or give feedback on the app
              </span>
            </a>
          </div>
        </div>
      );
  }
}

export default Document;
