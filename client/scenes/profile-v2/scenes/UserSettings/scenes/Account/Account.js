import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";



const Account = ({ match, profile }) => {
  return <div className="user-settings__edit-account w-100 mt-5">account</div>;
};

export default withRouter(Account);
