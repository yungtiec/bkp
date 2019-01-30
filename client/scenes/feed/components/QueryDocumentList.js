import React from "react";
import HeroHeadline from "./HeroHeadline";
import { ArticleStyleLoader } from "../../../components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { fetchFilteredDocumentsWithStats } from "../data/actions";
import {
  getFilteredDocuments,
  getFilteredDocumentsOffsetAndLimit
} from "../data/reducer";
import DocumentList from "./DocumentList";

class QueryDocumentList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchFilteredDocumentsWithStats();
  }

  render() {
    if (!this.props.documentIds)
      return <ArticleStyleLoader mobile={this.props.mobile} />;
    else return <DocumentList {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { documentIds, documentsById } = getFilteredDocuments(state);
  const { endOfResult } = getFilteredDocumentsOffsetAndLimit(state);
  return {
    documentIds,
    documentsById,
    endOfResult,
    mobile: state.data.environment.mobile
  };
};

const actions = {
  fetchFilteredDocumentsWithStats
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryDocumentList)
);
