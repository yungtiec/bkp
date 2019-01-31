import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { MainColumn, LeftColumn } from "./components";
import { getUserProfile } from "../../data/reducer";

class PublicProfile extends React.Component {
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
  }

  render() {
    const { match, profile, screenWidth } = this.props;
    return (
      <div className={`app-container mt-3 pb-4 d-flex`}>
        {screenWidth > 992 ? (
          <LeftColumn
            gridClassnames="w-25"
            profile={profile}
            screenWidth={screenWidth}
          />
        ) : null}
        <Switch>
          <Route
            path={`${match.url}/:tab`}
            render={() => (
              <MainColumn
                profile={profile}
                gridClassnames={screenWidth > 992 ? "w-75" : "w-100"}
              />
            )}
          />
          <Redirect
            from={match.url}
            exact
            to={`${match.url}/all-contributions`}
          />
        </Switch>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  profile: getUserProfile(state),
  screenWidth: state.data.environment.width,
  ...ownProps
});

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(PublicProfile)
);
