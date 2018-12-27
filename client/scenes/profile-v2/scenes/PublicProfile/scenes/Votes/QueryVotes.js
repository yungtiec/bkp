import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUserVotes } from "./data/actions";
import {
  getUserVotes,
  getUserVotesOffsetAndLimit
} from "./data/reducer";
import Votes from "./Votes";
import { animateScroll as scroll } from "react-scroll";

class QueryVotes extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserVotes(this.props.profile.user_handle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.user_handle !== nextProps.profile.user_handle) {
      this.props.fetchUserVotes(nextProps.profile.user_handle);
    }
    if (this.props.offset !== nextProps.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.voteIds) return "loading";
    return <Votes {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { votesById, voteIds } = getUserVotes(state);
  const { offset, endOfResult } = getUserVotesOffsetAndLimit(state);
  return {
    ...ownProps,
    votesById,
    voteIds,
    offset,
    endOfResult
  };
};

const actions = {
  fetchUserVotes
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryVotes)
);
