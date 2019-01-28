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
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateSelectedProject,
  updateProjectScorecard,
  updateContentHtml,
  updateTitle,
  updateHeaderImageUrl
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

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchManagedProjects();
  }

  render() {
    return <LoadableDocumentUpload {...this.props} />;
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
    headerImageUrl,
    scorecard,
    scorecardCompleted
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
    headerImageUrl
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
  updateProjectScorecard,
  updateContentHtml,
  updateTitle,
  updateHeaderImageUrl
};

export default withRouter(connect(mapState, actions)(MyComponent));
