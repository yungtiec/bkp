import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchLastestDocumentsWithStats } from "../../../../../../data/reducer";
import { getDocumentListing } from "../../../../../../data/reducer";
import { putStatusBySlug } from "../../../../../document/data/documentMetadata/service"

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
    this.state = {
      documentUpdated: false
    }
  }

  async componentDidMount() {
   await this.props.loadInitialData();
  }

  documentUpdatedSuccessfully() {
    this.setState({
      documentUpdated: true
    }, () => {
      setInterval(() => {
        this.setState({
          documentUpdated: false
        })
      }, 6000);
    })
  }

  render() {
    if (!this.props.documents) return null;
    else return <LoadableAdminVersionList
      documentUpdatedSuccessfully={this.documentUpdatedSuccessfully}
      documentUpdated={this.state.documentUpdated} {...this.props}
    />;
  }
}

const mapState = state => {
  console.log('mapping state', state);
  const { documents } = getDocumentListing(state);
  return {
    documents
  };
};

const actions = dispatch => {
  return {
    async loadInitialData() {
      dispatch(fetchLastestDocumentsWithStats());
    },
    putStatusBySlug
  };
};

export default connect(mapState, actions)(MyComponent);
