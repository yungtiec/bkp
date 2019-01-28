import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { getUserProfile } from "../../data/reducer";

const LoadableQueryUserSettings = Loadable({
  loader: () => import("./UserSettings"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let Profile = loaded.default;
    return <Profile {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return <LoadableQueryUserSettings {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return {
    profile: getUserProfile(state),
    screenWidth: state.data.environment.width,
    ...ownProps
  };
};

const actions = (dispatch, ownProps) => {
  return {};
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
