import React from "react";
import HeroHeadline from "./HeroHeadline";
import { ArticleStyleLoader } from "../../../components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { fetchFeatureDocuments } from "../data/actions";
import { getFeatureDocuments } from "../data/reducer";

class QueryHeroHeadline extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchFeatureDocuments();
  }

  render() {
    if (!this.props.featureDocumentIds)
      return (
        <ArticleStyleLoader
          mobile={this.props.screenWidth < 768}
          headline={true}
        />
      );
    else return <HeroHeadline {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { documentsById, featureDocumentIds } = getFeatureDocuments(state);

  return {
    documentsById,
    featureDocumentIds,
    mobile: state.data.environment.mobile,
    screenWidth: state.data.environment.width
  };
};

const actions = {
  fetchFeatureDocuments
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryHeroHeadline)
);
