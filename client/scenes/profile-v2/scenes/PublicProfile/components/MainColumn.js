import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { AllContributions, Documents, Comments, Likes } from "../scenes";

const TAB_OPTIONS = {
  "all-contributions": AllContributions,
  documents: Documents,
  comments: Comments,
  likes: Likes
};

const MainColumn = ({ match }) => {
  const Tab = TAB_OPTIONS[match.params.tab];
  return <Tab tab={match.params.tab} />;
};

export default withRouter(MainColumn);
