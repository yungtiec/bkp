import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUserContributions } from "../../data/actions";
import { getUserContributions } from "../../data/reducer";
import AllContributions from "./AllContributions";

class QueryAllContributions extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUserContributions(this.props.profile.user_handle);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.profile.user_handle !== nextProps.profile.user_handle) {
      this.props.fetchUserContributions(nextProps.profile.user_handle);
    }
  }

  render() {
    if (!this.props.contributionIds) return "loading";
    return <AllContributions {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { contributionsById, contributionIds } = getUserContributions(state);
  return {
    ownProps,
    contributionsById,
    contributionIds
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
