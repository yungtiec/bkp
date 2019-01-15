import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router-dom";
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
    const match = matchPath(this.props.match.url, {
      path: "/profile/:userHandle/:tab",
      exact: true,
      strict: false
    });
    match &&
      match.params &&
      this.props.fetchUserDocuments(match.params.userHandle.slice(1));
  }

  componentDidUpdate(prevProps) {
    const prevMatch = matchPath(prevProps.match.url, {
      path: "/profile/:userHandle/:tab",
      exact: true,
      strict: false
    });
    const match = matchPath(this.props.match.url, {
      path: "/profile/:userHandle/:tab",
      exact: true,
      strict: false
    });
    if (
      match &&
      match.params &&
      prevMatch &&
      prevMatch.params &&
      prevMatch.params.userHandle !== match.params.userHandle
    ) {
      this.props.fetchUserDocuments(match.params.userHandle.slice(1));
    }
    if (prevProps.offset !== this.props.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.documentIds && !this.props.endOfResult) return "loading";
    if (!this.props.documentIds && this.props.endOfResult) return null;
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
