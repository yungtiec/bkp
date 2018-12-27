import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUserDocuments } from "./data/actions";
import {
  getUserDocuments,
  getUserDocumentsOffsetAndLimit
} from "./data/reducer";
import Documents from "./Documents";
import { animateScroll as scroll } from "react-scroll";

class QueryDocuments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserDocuments(this.props.profile.user_handle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.user_handle !== nextProps.profile.user_handle) {
      this.props.fetchUserDocuments(nextProps.profile.user_handle);
    }
    if (this.props.offset !== nextProps.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.documentIds) return "loading";
    return <Documents {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { documentsById, documentIds } = getUserDocuments(state);
  const { offset, endOfResult } = getUserDocumentsOffsetAndLimit(state);
  return {
    ...ownProps,
    documentsById,
    documentIds,
    offset,
    endOfResult
  };
};

const actions = {
  fetchUserDocuments
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryDocuments)
);
