import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";
import { batchActions } from "redux-batched-actions";
import { getVersionMetadata } from "./data/versionMetadata/reducer";
import {
  getDocumentMetadata,
  getDocumentLatestVersion,
  isClosedForComment
} from "./data/documentMetadata/reducer";
import {
  fetchMetadataBySlug,
  upvoteDocument,
  downvoteDocument
} from "./data/documentMetadata/actions";
import { getAllDocumentQuestions } from "./data/versionQnas/reducer";
import { fetchLatestQuestionsBySlug } from "./data/versionQnas/actions";
import DocumentContainerBySlug from "./DocumentContainerBySlug";
import history from "../../history";

class QueryDocumentContainerBySlug extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    batchActions([
      this.props.fetchMetadataBySlug(this.props.match.params.slug),
      //this.props.fetchLatestQuestionsBySlug(
      //  this.props.match.params.slug
      //)
    ]);
  }

  render() {
    console.log('this.props', this.props);
    if (!this.props.documentMetadata.id)
      return null;
    return <DocumentContainerBySlug {...this.props} />;
  }
}

const mapState = state => {
  return {
    documentMetadata: getDocumentMetadata(state),
    isClosedForComment: isClosedForComment(state)
  };
};

const actions = {
  fetchMetadataBySlug,
  fetchLatestQuestionsBySlug,
  upvoteDocument,
  downvoteDocument
};

export default withRouter(connect(mapState, actions)(QueryDocumentContainerBySlug));
