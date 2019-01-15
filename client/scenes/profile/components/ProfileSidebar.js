import "./ProfileSidebar.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import CheckboxTree from "react-checkbox-tree";

export default class ProfileSidebar extends Component {
  constructor() {
    super();

    this.state = {
      expanded: ["status", "issue"]
    };
  }

  render() {
    return (
      <div className="profile-engagement-items__sidebar">
        {this.props.children}
        <CheckboxTree
          nodes={this.props.nodes}
          onlyLeafCheckboxes={true}
          checked={this.props.checked}
          expanded={this.state.expanded}
          onCheck={checked => this.props.checkSidebarFilter(checked)}
          onExpand={expanded => this.setState({ expanded })}
        />
      </div>
    );
  }
}
