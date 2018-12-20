import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import moment from "moment";
import { batchActions } from "redux-batched-actions";

// global
import { updateOnboardStatus, loadModal } from "../../../../data/reducer";

// document UI context
import {
  sortCommentBy,
  updateIssueFilter,
  toggleSidebar,
  toggleSidebarContext,
  toggleAnnotationHighlight,
  updateVerificationStatusInView,
  updateEngagementTabInView,
  getSidebarCommentContext,
  updateSidebarCommentContext
} from "../../reducer";

// document/qnas
import {
  fetchQuestionsByVersionId,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer
} from "../../data/versionQnas/actions";
import { getAllDocumentQuestions } from "../../data/versionQnas/reducer";

// document/metadata
import {
  fetchMetadataByVersionId,
  editScorecard
} from "../../data/versionMetadata/actions";
import { getVersionMetadata } from "../../data/versionMetadata/reducer";
import {
  upvoteDocument,
  downvoteDocument
} from "../../data/documentMetadata/actions";
import { getDocumentMetadata } from "../../data/documentMetadata/reducer";

// document/comments
import {
  fetchCommentsByVersionId,
  addNewCommentSentFromServer,
  addNewComment
} from "../../data/comments/actions";
import { getAllComments } from "../../data/comments/reducer";

// document/tags
import {
  getAllTags,
  getTagsWithCountInDocument,
  getTagFilter
} from "../../data/tags/reducer";
import { updateTagFilter } from "../../data/tags/actions";

const LoadableVersion = Loadable({
  loader: () => import("./Version"),
  loading: () => (
    <SquareLoader
      key="LoadableVersion"
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Version = loaded.default;
    return <Version {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    this.loadData();
  }

  //componentDidUpdate(prevProps) {
  //  const versionId = this.props.documentMetadata.versions[0].id;
  //  const prevVersionId = prevProps.documentMetadata.versions[0].id;
  //  if (
  //    prevVersionId !== versionId
  //  ) {
  //    this.loadData({
  //      versionId: versionId
  //    });
  //  }
  //}

  loadData() {
    this.props.fetchCommentsByVersionId(this.props.documentMetadata.id);
  }

  render() {
    return <LoadableVersion {...this.props} />;
  }
}

const mapState = state => {
  const documentMetadata = getDocumentMetadata(state);
  const {
          commentsById,
          commentIds,
          unfilteredCommentIds,
          nonSpamCommentIds,
          commentsLoading
        } = getAllComments(state, documentMetadata.content_html);
  const {
          sidebarOpen,
          annotationHighlight,
          verificationStatus,
          commentSortBy,
          commentIssueFilter,
          sidebarContext
        } = state.scenes.document;

  return {
    // global
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    anonymity: !!state.data.user.id && state.data.user.anonymity,
    onboard: state.data.user.onboard,
    // metadata
    isClosedForComment:
    Number(documentMetadata.comment_until_unix) -
    Number(moment().format("x")) <=
    0,
    documentMetadata: getDocumentMetadata(state),
    // comments
    commentsLoading,
    commentsById,
    commentIds,
    nonSpamCommentIds,
    unfilteredCommentIds,
    // tags
    tags: getAllTags(state),
    tagFilter: getTagFilter(state),
    tagsWithCountInDocument: getTagsWithCountInDocument(state),
    // UI context
    sidebarOpen,
    annotationHighlight,
    verificationStatus,
    commentSortBy,
    commentIssueFilter,
    sidebarContext,
    sidebarCommentContext: getSidebarCommentContext(state)
  };
};

const actions = {
  // global
  updateOnboardStatus,
  loadModal,
  // metadata
  fetchMetadataByVersionId,
  upvoteDocument,
  downvoteDocument,
  editScorecard,
  // qnas
  fetchQuestionsByVersionId,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer,
  // comments
  fetchCommentsByVersionId,
  addNewComment,
  addNewCommentSentFromServer,
  // UI context
  sortCommentBy,
  updateTagFilter,
  updateIssueFilter,
  updateSidebarCommentContext,
  toggleSidebar,
  toggleSidebarContext,
  toggleAnnotationHighlight,
  updateVerificationStatusInView
};

export default withRouter(connect(mapState, actions)(MyComponent));
