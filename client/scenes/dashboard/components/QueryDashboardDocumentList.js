import React, { Fragment } from "react";
import { range } from "lodash";
import { ArticleStyleLoader } from "../../../components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { fetchDocumentsWithStats } from "../data/actions";
import { getDocuments } from "../data/reducer";
import DashboardDocumentList from "./DashboardDocumentList";

class QueryDashboardDocumentList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchDocumentsWithStats();
  }

  render() {
    if (this.props.documentsLoading)
      return (
        <Fragment>
          {range(5).map(rand => (
            <ArticleStyleLoader
              hideImg={true}
              mobile={this.props.screenWidth < 768}
            />
          ))}
        </Fragment>
      );
    else return <DashboardDocumentList {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const {
    documentIds,
    documentsById,
    allDocumentsFetched,
    documentsLoading,
    additionalDocumentsLoading
  } = getDocuments(state);
  return {
    documentIds,
    documentsById,
    allDocumentsFetched,
    documentsLoading,
    additionalDocumentsLoading,
    screenWidth: state.data.environment.width
  };
};

const actions = {
  fetchDocumentsWithStats
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryDashboardDocumentList)
);
