import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { notify } from "reapop";
// metadata
import {
  upvoteDocument,
  downvoteDocument
} from "../../data/documentMetadata/actions";
import { fetchMetadataByVersionId } from "../../data/versionMetadata/actions";
import { getVersionMetadata } from "../../data/versionMetadata/reducer";
import { getDocumentMetadata } from "../../data/documentMetadata/reducer";
// qnas
import { getAllDocumentQuestions } from "../../data/versionQnas/reducer";
import { fetchQuestionsByVersionId } from "../../data/versionQnas/actions";
// comments
import { fetchCommentsByVersionId } from "../../data/comments/actions";
import { getOutstandingIssues } from "../../data/comments/reducer";
// upload
import { getVersionUploadMetadata } from "../../data/upload/reducer";
import {
  fetchCollaboratorOptions,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  updateCollaborators,
  addNewIssue,
  removeIssue,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateVersionNumber,
  updateProjectScorecard
} from "../../data/upload/actions";
// UI context
import { toggleSidebar } from "../../reducer";

const LoadableVersionUpload = Loadable({
  loader: () => import("./VersionUpload"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let VersionUpload = loaded.default;
    return <VersionUpload {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  componentDidMount() {
    const versionId = this.props.documentMetadata.id;
    batchActions([
      //this.props.fetchMetadataByVersionId(versionId),
      //this.props.fetchQuestionsByVersionId(versionId),
      //this.props.fetchCommentsByVersionId(versionId),
      this.props.fetchCollaboratorOptions(this.props.documentMetadata.project.symbol)
    ]);
  }

  render() {
    if (!this.props.versionMetadata.id || !this.props.versionQnaIds)
      return null;
    else return <LoadableVersionUpload {...this.props} />;
  }
}

const mapState = state => {
  const { versionQnasById, versionQnaIds } = getAllDocumentQuestions(state);
  const { versionMetadata, versionMetadataLoading } = getVersionMetadata(state);
  const {
          importedMarkdown,
          resolvedIssueIds,
          collaboratorEmails,
          collaboratorOptions,
          newResolvedIssues,
          versionNumber,
          commentPeriodUnit,
          commentPeriodValue,
          scorecard,
          scorecardCompleted
        } = getVersionUploadMetadata(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    sidebarOpen: state.scenes.document.sidebarOpen,
    // metadata
    versionMetadata,
    documentMetadata: getDocumentMetadata(state),
    // qnas
    versionQnasById,
    versionQnaIds,
    // outstanding issues
    outstandingIssues: getOutstandingIssues(state),
    // upload
    versionNumber,
    importedMarkdown,
    resolvedIssueIds,
    collaboratorEmails,
    collaboratorOptions,
    newResolvedIssues,
    // comment
    commentPeriodUnit,
    commentPeriodValue,
    // scorecard
    scorecardCompleted,
    scorecard
  };
};

const actions = {
  // global UI context
  notify,
  // qnas
  fetchQuestionsByVersionId,
  // metadata
  fetchMetadataByVersionId,
  upvoteDocument,
  downvoteDocument,
  // comments
  fetchCommentsByVersionId,
  // upload
  fetchCollaboratorOptions,
  importMarkdown,
  uploadMarkdownToServer,
  selectIssueToResolve,
  updateCollaborators,
  addNewIssue,
  removeIssue,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateVersionNumber,
  updateProjectScorecard,
  // UI context
  toggleSidebar
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
