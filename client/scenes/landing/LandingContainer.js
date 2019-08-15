import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autobind from "react-autobind";
import Landing from "./Landing";

class LandingContainer extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    return <Landing {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    me: state.user
  };
};

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(LandingContainer)
);
