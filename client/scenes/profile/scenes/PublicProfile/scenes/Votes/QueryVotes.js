import React, { Component } from "react";
import { connect } from "react-redux";
import { range } from "lodash";
import { withRouter, matchPath } from "react-router-dom";
import { fetchUserVotes } from "./data/actions";
import { getUserVotes, getUserVotesOffsetAndLimit } from "./data/reducer";
import Votes from "./Votes";
import { animateScroll as scroll } from "react-scroll";
import { ArticleStyleLoader } from "../../../../../../components";

class QueryVotes extends React.Component {
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
      this.props.fetchUserVotes(match.params.userHandle.slice(1));
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
      this.props.fetchUserVotes(match.params.userHandle.slice(1));
    }
    if (prevProps.offset !== this.props.offset) window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.voteIds && !this.props.endOfResult)
      return (
        <div style={{ flex: "1", background: "white" }} className="p-3">
          {range(5).map(rand => (
            <ArticleStyleLoader mobile={this.props.screenWidth < 768} />
          ))}
        </div>
      );
    if (!this.props.voteIds && this.props.endOfResult) return null;
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
    endOfResult,
    screenWidth: state.data.environment.width
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
