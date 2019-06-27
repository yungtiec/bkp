import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnFeaturedDocuments, canLoadMore } from "./data/reducer";
import { fetchOwnFeaturedDocuments } from "./data/actions";
import { MyDocumentsList } from "../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

class FeaturedDocuments extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  async componentDidMount() {
    await this.props.fetchOwnFeaturedDocuments();
  }

  render() {
    console.log(this.props);
    return (
      <MyDocumentsList
        documents={this.props.featuredDocuments}
        canLoadMore={this.props.canLoadMore}
        type='featured'
      />
    );
  }
}

const mapState = state => {
  const {
    featuredDocuments
  } = getOwnFeaturedDocuments(state);
  return {
    featuredDocuments,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchOwnFeaturedDocuments };

export default connect(
  mapState,
  actions
)(FeaturedDocuments);
