import React from "react";
import HeroHeadline from "./HeroHeadline";
import { ArticleStyleLoader } from "../../../components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { fetchFeatureDocuments } from "../data/actions";
import { getFeatureDocuments } from "../data/reducer";

const LoadableQueryHeroHeadline = Loadable({
  loader: () => import("./HeroHeadline"),
  loading: () => <ArticleStyleLoader />,
  render(loaded, props) {
    let HeroHeadline = loaded.default;
  },
  delay: 10000
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchFeatureDocuments();
  }

  render() {
    console.log(this.props)
    if (!this.props.featureDocuments) return <ArticleStyleLoader />;
    else return <HeroHeadline {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return {
    featureDocuments: getFeatureDocuments(state)
  };
};

const actions = {
  fetchFeatureDocuments
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
