import React, { Component } from "react";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";

const LoadableAbout = Loadable({
  loader: () => import("./main"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  delay: 1000
});

export default class MyComponent extends React.Component {
  render() {
    return <LoadableAbout {...this.props} />;
  }
}