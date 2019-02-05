import React, {Component} from "react";
import Loadable from "react-loadable";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Select from "react-select";
import {SquareLoader} from "halogenium";
import moment from "moment";

const categories = [
  {label : 'Proposed Laws And Regulations', value : 'proposed-laws-regulations'},
  {label : 'General', value : 'general'},
  {label : 'Regulatory', value : 'regulatory'},
  {label : 'Regulatory For Comment', value : 'regulatory-for-comment'},
  {label : 'Scorecard', value : 'scorecard'},
];

class CategorySelect extends React.Component {

  render() {
    return (
      <div className="mb-4">
        Category:
        <Select
          name="upload__project-select"
          value={this.props.category}
          style={{width : '300px'}}
          onChange={this.props.handleCategoryChange}
          options={categories}
          placeholder="select..."
        />
      </div>)
  }
}

const mapState = state => {

  return {};
};

const actions = {};

export default withRouter(connect(mapState, actions)(CategorySelect));
