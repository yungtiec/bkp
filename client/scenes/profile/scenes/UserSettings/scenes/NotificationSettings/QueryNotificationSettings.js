import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { updateProfile, updateAvatar } from "../../../../data/actions";

const LoadableQueryEdiProfile = Loadable({
  loader: () => import("./NotificationSettings"),
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
    return <LoadableQueryEdiProfile {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return { ...ownProps };
};

const actions = {
  updateProfile,
  updateAvatar
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
