import React, { Fragment } from "react";
import { range } from "lodash";
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
      return (
        <Fragment>
          {range(5).map(rand => (
            <ArticleStyleLoader mobile={this.props.screenWidth < 768} />
          ))}
        </Fragment>
      );
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
    mobile: state.data.environment.mobile,
    screenWidth: state.data.environment.width
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
