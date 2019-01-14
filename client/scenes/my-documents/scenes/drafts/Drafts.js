import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import { getOwnDrafts, canLoadMore } from "./data/reducer";
import { fetchOwnDrafts } from "./data/actions";
import { MyDocumentsList } from "../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

class Drafts extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchOwnDrafts();
  }

  render() {
    return (
      <MyDocumentsList
        documents={this.props.draftDocuments}
        canLoadMore={this.props.canLoadMore}
      />
    );
  }
}

const mapState = state => {
  const { draftDocuments } = getOwnDrafts(state);
  console.log({draftDocuments});
  return {
    draftDocuments,
    canLoadMore: canLoadMore(state)
  };
};

const actions = { fetchOwnDrafts };

export default connect(
  mapState,
  actions
)(Drafts);
