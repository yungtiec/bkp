import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Projects,
  Collaborations,
  Project,
  Profile,
  Admin,
  Unauthorized,
  Upload,
  ActivityBoard,
  Dashboard,
  Landing,
  Document,
  DocumentBySlug,
  Wizard,
  MyDocuments
} from "./scenes";
import {
  Login,
  Signup,
  Layout,
  RequestPasswordReset,
  ResetPassword,
  LayoutWithNav,
  RouteWithLayout
} from "./components";
import { me, initEnvironment } from "./data/reducer";

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <RouteWithLayout layout={Layout} path="/login" component={Login} />
          <RouteWithLayout layout={Layout} path="/signup" component={Signup} />
          <RouteWithLayout
            layout={Layout}
            path="/request-password-reset"
            component={RequestPasswordReset}
          />
          <RouteWithLayout
            layout={Layout}
            path="/reset-password/:token"
            component={ResetPassword}
          />
          {isLoggedIn && (
            <RouteWithLayout
              layout={LayoutWithNav}
              path="/dashboard"
              component={Dashboard}
            />
          )}
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/projects"
            component={Projects}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/s/:slug"
            component={DocumentBySlug}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/project/:symbol/document/:documentId"
            component={Document}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/project/:symbol"
            component={Project}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/documents/me"
            component={MyDocuments}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/wizard"
            component={Wizard}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/edit/:slug"
            component={Wizard}
          />
          {isLoggedIn && (
            <RouteWithLayout
              layout={LayoutWithNav}
              path="/upload"
              component={Upload}
            />
          )}
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/activity-board"
            component={ActivityBoard}
          />
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/unauthorized"
            component={Unauthorized}
          />
          <Route path="/landing" component={Landing} />
          {isLoggedIn && (
            <RouteWithLayout
              layout={LayoutWithNav}
              path="/user/:userId"
              component={Profile}
            />
          )}
          {isLoggedIn && (
            <RouteWithLayout
              layout={LayoutWithNav}
              path="/admin"
              component={Admin}
            />
          )}
          <Route
            path="/dex-overview"
            render={() => <Redirect to="/project/TL/document/9/version/10/" />}
          />
          {/* Displays our Collaborations component as a fallback */}
          <RouteWithLayout
            layout={LayoutWithNav}
            path="/"
            component={Collaborations}
          />
        </Switch>
      </div>
    );
  }
}

const mapState = state => {
  const { height, isMobile, width } = state.data.environment;
  return {
    isLoggedIn: !!state.data.user.id,
    userEmail: state.data.user && state.data.user.email,
    height,
    isMobile,
    width
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
      dispatch(initEnvironment());
    }
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Routes)
);

Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
