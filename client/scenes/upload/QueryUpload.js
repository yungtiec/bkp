import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { SquareLoader } from "halogenium";
import { batchActions } from "redux-batched-actions";
import { toggleSidebar } from "./reducer";
import {
  getImportedMarkdown,
  getCollaboratorEmails,
  getCollaboratorOptions,
  getCommentPeriodUnit,
  getCommentPeriodValue,
  getSelectedProject,
  getProjectScorecardStatus
} from "./data/upload/reducer";
import {
  importMarkdown,
  uploadMarkdownToServer,
  updateCollaborators,
  removeCollaborator,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateSelectedProject,
  updateProjectScorecard
} from "./data/upload/actions";
import {
  fetchAllProjects,
  fetchManagedProjects,
  getManagedProjects
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
  return {
    // global metadata
    width: state.data.environment.width,
    isLoggedIn: !!state.data.user.id,
    currentUser: state.data.user,
    sidebarOpen: state.scenes.upload.sidebarOpen,
    importedMarkdown: getImportedMarkdown(state),
    collaboratorEmails: getCollaboratorEmails(state),
    collaboratorOptions: getCollaboratorOptions(state),
    commentPeriodUnit: getCommentPeriodUnit(state),
    commentPeriodValue: getCommentPeriodValue(state),
    selectedProject: getSelectedProject(state),
    scorecardCompleted: getProjectScorecardStatus(state),
    projectsBySymbol,
    projectSymbolArr
  };
};

const actions = {
  fetchManagedProjects,
  importMarkdown,
  uploadMarkdownToServer,
  updateCollaborators,
  removeCollaborator,
  updateCommentPeriodUnit,
  updateCommentPeriodValue,
  updateSelectedProject,
  notify,
  toggleSidebar,
  fetchAllProjects,
  updateProjectScorecard
};

export default withRouter(connect(mapState, actions)(MyComponent));
