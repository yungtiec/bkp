import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { updateAccount, updateUserPassword } from "../../../../data/actions";

const LoadableQueryAccount = Loadable({
  loader: () => import("./Account"),
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
    return <LoadableQueryAccount {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return { ...ownProps };
};

const actions = {
  updateUserPassword,
  updateAccount
};

export default withRouter(
  connect(
    mapState,
    actions
  )(MyComponent)
);
