import React, { Component } from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { SquareLoader } from "halogenium";
import moment from "moment";

class ActiveToggle extends React.Component {
  render() {
    console.log('status', this.props.status);
    let docStatus;
    if (!this.props.status.submitted && !this.props.status.reviewed) {
      docStatus = 'draft';
    } else if (this.props.status.submitted && !this.props.status.reviewed) {
      docStatus = 'published';
    } else if (this.props.status.submitted && this.props.status.reviewed) {
      docStatus = 'featured';
    }

    console.log({docStatus});
    console.log('this.props.user', this.props.user);
    const userRoles = this.props.user.roles;

    const options = [
      { label: "Draft", value: 'draft' },
      { label: "Published", value: 'published' }
    ];

    if (userRoles[0] && userRoles[0].name === 'admin') {
      options.push({ label: "Featured", value: 'featured' });
    }
    return (
      <Select
        name="upload__project-select"
        value={docStatus}
        onChange={this.props.handleStatusChange}
        style={{ width: "300px" }}
        menuContainerStyle={{ width: "300px" }}
        options={options}
        placeholder="select..."
      />
    );
  }
}

const mapState = state => {
  return {};
};

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(ActiveToggle)
);
