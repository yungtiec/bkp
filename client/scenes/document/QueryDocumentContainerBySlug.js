import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { batchActions } from "redux-batched-actions";
import { toggleSidebar, toggleSidebarContext, resetSidebar } from './reducer'
import {
  getDocumentMetadata,
  getDocumentLatestVersion,
  isClosedForComment
} from "./data/documentMetadata/reducer";
import {
  fetchMetadataBySlug,
  resetDocumentMetadata,
  upvoteDocument,
  downvoteDocument
} from "./data/documentMetadata/actions";
import DocumentContainerBySlug from "./DocumentContainerBySlug";
import history from "../../history";
import {hideEditor, showEditor} from './data/ckEditor/actions';

class QueryDocumentContainerBySlug extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    batchActions([
      this.props.fetchMetadataBySlug(this.props.match.params.slug, this.props.location.pathname),
      this.props.resetSidebar()
    ]);
  }

  componentWillUnmount() {
    this.props.resetDocumentMetadata();
  }

  render() {
    if (!this.props.documentMetadata.id) return null;
    return <DocumentContainerBySlug {...this.props} />;
  }
}

const mapState = state => {
  return {
    width: state.data.environment.width,
    documentMetadata: getDocumentMetadata(state),
    isClosedForComment: isClosedForComment(state),
    displayEditor: state.scenes.document.data.ckEditor.displayEditor,
    isLoggedIn: !!state.data.user.id,
    userId: state.data.user.id,
    sidebarOpen: state.scenes.document.sidebarOpen,
    sidebarContext: state.scenes.document.sidebarContext
  };
};

const actions = {
  fetchMetadataBySlug,
  resetDocumentMetadata,
  upvoteDocument,
  downvoteDocument,
  showEditor,
  hideEditor,
  toggleSidebar,
  toggleSidebarContext,
  resetSidebar
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryDocumentContainerBySlug)
);
