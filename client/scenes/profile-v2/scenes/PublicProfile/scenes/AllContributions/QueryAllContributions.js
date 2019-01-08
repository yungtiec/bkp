import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, matchPath } from "react-router-dom";
import { fetchUserContributions } from "./data/actions";
import {
  getUserContributions,
  getUserContributionsOffsetAndLimit
} from "./data/reducer";
import AllContributions from "./AllContributions";
import { animateScroll as scroll } from "react-scroll";

class QueryAllContributions extends React.Component {
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
      this.props.fetchUserContributions(match.params.userHandle.slice(1));
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
      this.props.fetchUserContributions(match.params.userHandle.slice(1));
    }
    if (prevProps.offset !== this.props.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.contributionIds && !this.props.endOfResult)
      return "loading";
    if (!this.props.contributionIds && this.props.endOfResult) return null;
    return <AllContributions {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { contributionsById, contributionIds } = getUserContributions(state);
  const { offset, endOfResult } = getUserContributionsOffsetAndLimit(state);
  return {
    ...ownProps,
    contributionsById,
    contributionIds,
    offset,
    endOfResult
  };
};

const actions = {
  fetchUserContributions
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryAllContributions)
);
