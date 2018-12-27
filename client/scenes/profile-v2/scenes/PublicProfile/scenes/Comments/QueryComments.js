import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUserComments } from "./data/actions";
import {
  getUserComments,
  getUserCommentsOffsetAndLimit
} from "./data/reducer";
import Comments from "./Comments";
import { animateScroll as scroll } from "react-scroll";

class QueryComments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserComments(this.props.profile.user_handle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.user_handle !== nextProps.profile.user_handle) {
      this.props.fetchUserComments(nextProps.profile.user_handle);
    }
    if (this.props.offset !== nextProps.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.commentIds) return "loading";
    return <Comments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { commentsById, commentIds } = getUserComments(state);
  const { offset, endOfResult } = getUserCommentsOffsetAndLimit(state);
  return {
    ...ownProps,
    commentsById,
    commentIds,
    offset,
    endOfResult
  };
};

const actions = {
  fetchUserComments
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryComments)
);
