import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { ProfileDetails } from "./index";
import PropTypes from "prop-types";
import moment from "moment";

const isDev = process.env.NODE_ENV === "development";

const LeftColumn = ({ match, profile, gridClassnames }) => {
  return (
    <div className={`${gridClassnames} py-4 px-1`}>
      <ProfileDetails profile={profile} />
    </div>
  );
};

export default withRouter(LeftColumn);