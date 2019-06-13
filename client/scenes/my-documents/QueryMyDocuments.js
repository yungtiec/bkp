import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";

const LoadableQueryMyDocuments = Loadable({
  loader: () => import("./MyDocuments"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let MyDocuments = loaded.default;
    return <MyDocuments {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <LoadableQueryMyDocuments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return {
    isAdmin: !!state.data.user.roles && state.data.user.roles.filter(r => r.name === "admin").length
  };
};

const mapDispatch = (dispatch, ownProps) => {
  return {};
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(MyComponent)
);
