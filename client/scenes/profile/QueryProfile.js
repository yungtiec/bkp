import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { fetchUserProfile } from "./data/actions";
import { getUserProfile } from "./data/reducer";

const LoadableQueryProfile = Loadable({
  loader: () => import("./Profile"),
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

  fetchVividIcon() {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/vivid-icons";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  componentDidMount() {
    this.fetchVividIcon();
    this.props.fetchUserProfile(this.props.match.params.userHandle.slice(1));
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.userHandle !== this.props.match.params.userHandle
    ) {
      this.props.fetchUserProfile(this.props.match.params.userHandle.slice(1));
    }
  }

  render() {
    if (!this.props.profile) return null;
    return <LoadableQueryProfile {...this.props} />;
  }
}

const mapState = state => {
  return {
    profile: getUserProfile(state),
    me: state.data.user,
    screenWidth: state.data.environment.width
  };
};

const actions = {
  fetchUserProfile
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
