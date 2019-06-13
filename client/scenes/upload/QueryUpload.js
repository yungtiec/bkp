import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { toggleSidebar } from "./reducer";
import { getUploadMetadata } from "./data/upload/reducer";
import {
  uploadHtmlToServer,
  updateCollaborators,
  removeCollaborator,
  resetSubmitForm,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateSelectedProject,
  updateProjectScorecard,
  updateContentHtml,
  updateTitle,
  updateCategory,
  updateTags,
  updateHeaderImageUrl,
  updateSummary,
  updateIndexDescription,
  updateHasAnnotator
} from "./data/upload/actions";
import {
  fetchAllProjects,
  fetchManagedProjects,
  getManagedProjects,
  loadModal,
  hideModal
} from "../../data/reducer";
import { notify } from "reapop";

const LoadableDocumentUpload = Loadable({
  loader: () => import("./Upload"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Upload = loaded.default;
    return <Upload {...props} />;
  },
  delay: 400
});

const LoadableDocumentUploadNonAdmin = Loadable({
  loader: () => import("./UploadNonAdmin"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let UploadNonAdmin = loaded.default;
    return <UploadNonAdmin {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('mounted');
  }

  render() {
    return this.props.currentUser.roles &&
    this.props.currentUser.roles.length &&
      this.props.currentUser.roles[0].name === 'admin' ?
        <LoadableDocumentUpload {...this.props} /> :
        <LoadableDocumentUploadNonAdmin {...this.props} />;
  }
}

const mapState = state => {
  const { projectsBySymbol, projectSymbolArr } = getManagedProjects(state);
  const {
    contentHtml,
    selectedProject,
    collaboratorEmails,
    collaboratorOptions,
    versionNumber,
    commentPeriodUnit,
    commentPeriodValue,
    title,
    category,
    tags,
    headerImageUrl,
    summary,
    scorecard,
    indexDescription,
    scorecardCompleted,
    hasAnnotator
  } = getUploadMetadata(state);
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    currentUser: state.data.user,
    sidebarOpen: state.scenes.upload.sidebarOpen,
    selectedProject,
    collaboratorEmails,
    collaboratorOptions,
    versionNumber,
    commentPeriodUnit,
    commentPeriodValue,
    scorecard,
    scorecardCompleted,
    projectsBySymbol,
    projectSymbolArr,
    contentHtml,
    title,
    category,
    tags,
    headerImageUrl,
    summary,
    indexDescription,
    hasAnnotator
  };
};

const actions = {
  loadModal,
  hideModal,
  fetchManagedProjects,
  uploadHtmlToServer,
  updateCollaborators,
  removeCollaborator,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateSelectedProject,
  notify,
  toggleSidebar,
  fetchAllProjects,
  resetSubmitForm,
  updateProjectScorecard,
  updateContentHtml,
  updateTitle,
  updateCategory,
  updateTags,
  updateHeaderImageUrl,
  updateSummary,
  updateIndexDescription,
  updateHasAnnotator
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
