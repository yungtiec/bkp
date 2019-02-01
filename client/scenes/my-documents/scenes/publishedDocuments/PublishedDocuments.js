import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnPublishedDocuments, canLoadMore } from "./data/reducer";
import { fetchOwnPublishedDocuments } from "./data/actions";
import { MyDocumentsList } from "../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

class PublishedDocuments extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  async componentDidMount() {
    await this.props.fetchOwnPublishedDocuments();
  }

  render() {
    console.log(this.props);
    return (
      <MyDocumentsList
        documents={this.props.publishedDocuments}
        canLoadMore={this.props.canLoadMore}
      />
    );
  }
}

const mapState = state => {
  const {
    publishedDocuments
  } = getOwnPublishedDocuments(state);
  return {
    publishedDocuments,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchOwnPublishedDocuments };

export default connect(
  mapState,
  actions
)(PublishedDocuments);
