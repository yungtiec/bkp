import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";

const LoadablePassword = Loadable({
  loader: () => import("./Password"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  delay: 400
});

class MyComponent extends React.Component {
  render() {
    return <LoadablePassword {...this.props} />;
  }
}

export default MyComponent;
