import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { AllContributions, Documents, Comments, Votes } from "../scenes";

const TAB_OPTIONS = {
  "all-contributions": AllContributions,
  documents: Documents,
  comments: Comments,
  votes: Votes
};

const MainColumn = ({ match, profile, gridClassnames }) => {
  const Tab = TAB_OPTIONS[match.params.tab];
  return (
    <Tab
      gridClassnames={`${gridClassnames}`}
      tab={match.params.tab}
      profile={profile}
    />
  );
};

export default withRouter(MainColumn);
