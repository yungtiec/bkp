import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchLastestDocumentsWithStats } from "../../../../../../data/reducer";
import { getDocumentListing } from "../../../../../../data/reducer";

const LoadableAdminVersionList = Loadable({
  loader: () => import("./AdminDocumentList"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let AdminVersionList = loaded.default;
    return <AdminVersionList {...props} />;
  },
  delay: 400
});

class MyComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  async componentDidMount() {
   await this.props.loadInitialData();
  }

  render() {
    if (!this.props.documents) return null;
    else return <LoadableAdminVersionList {...this.props} />;
  }
}

const mapState = state => {
  const { documents } = getDocumentListing(state);
  return {
    documents
  };
};

const actions = dispatch => {
  return {
    loadInitialData() {
      dispatch(fetchLastestDocumentsWithStats());
    }
  };
};

export default connect(mapState, actions)(MyComponent);
