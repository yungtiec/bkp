import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";
import { currentUserIsAdmin, editProfile } from "../../data/reducer";
import {
  fetchUserBasicInfo,
  changeAccessStatus,
  resetUserData,
  changeAnonymity
} from "./scenes/about/data/actions";
import { updateUserPassword } from "./scenes/password/data/actions";
import { getUserBasicInfo } from "./scenes/about/data/reducer";

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

  componentDidMount() {
    this.props.fetchUserBasicInfo(this.props.match.params.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.userId !== nextProps.match.params.userId) {
      this.props.fetchUserBasicInfo(nextProps.match.params.userId);
    }
  }

  render() {
    return <LoadableQueryProfile {...this.props} />;
  }
}

const mapState = state => {
  const basicInfo = getUserBasicInfo(state);
  const isAdmin = currentUserIsAdmin(state);
  return {
    basicInfo,
    isAdmin,
    myUserId: state.data.user && state.data.user.id,
    passwordUpdate: state.scenes.profile
  };
};

const actions = (dispatch, ownProps) => {
  return {
    fetchUserBasicInfo: userId => {
      dispatch(fetchUserBasicInfo(userId));
    },
    restrictAccess: () =>
      dispatch(
        changeAccessStatus({
          userId: ownProps.match.params.userId,
          accessStatus: "restricted"
        })
      ),
    restoreAccess: () =>
      dispatch(
        changeAccessStatus({
          userId: ownProps.match.params.userId,
          accessStatus: "restore"
        })
      ),
    changeAnonymity: () => dispatch(changeAnonymity()),
    editProfile: props => dispatch(editProfile(props)),
    resetUserData: () => dispatch(resetUserData()),
    updateUserPassword: async (myUserId, currentPassword, newPassword) => {
      return await dispatch(updateUserPassword(myUserId, currentPassword, newPassword));
    }
  };
};

export default withRouter(connect(mapState, actions)(MyComponent));
