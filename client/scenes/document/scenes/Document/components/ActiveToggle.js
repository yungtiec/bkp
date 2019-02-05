import React, {Component} from "react";
import Loadable from "react-loadable";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Select from "react-select";
import {SquareLoader} from "halogenium";
import moment from "moment";

class ActiveToggle extends React.Component {

  render() {
    console.log(this.props.status);
    return (
      <div className="mb-4">
        Status:
        <Select
          name="upload__project-select"
          value={this.props.status}
          onChange={this.props.handleStatusChange}
          style={{width : '300px'}}
          options={[{label : 'Draft', value : false}, {label : 'Published', value : true}]}
          placeholder="select..."
        />
      </div>)
  }
}

const mapState = state => {

  return {};
};

const actions = {};

export default withRouter(connect(mapState, actions)(ActiveToggle));
