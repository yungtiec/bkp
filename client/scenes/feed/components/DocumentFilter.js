import React, { Fragment } from "react";
import DocumentFilterDropdown from "./DocumentFilterDropdown";
import { connect } from "react-redux";
import { getFilterOptionMenus } from "../data/reducer";

const DocumentFilter = ({ optionMenus }) => (
  <div className="feed__filter-container my-5">
    <div className="feed__filter d-flex">
      <div className="feed__filter-item feed__filter-label">sort by</div>
      <DocumentFilterDropdown name="orderBy" label="hot">
        <Fragment>
          {optionMenus.orderBy.map(option => <span  className="feed__filter-option">{option.label}</span>)}
        </Fragment>
      </DocumentFilterDropdown>
      <div className="feed__filter-item feed__filter-label">filter by</div>
      <DocumentFilterDropdown name="sections" label="sections">
        <Fragment>
          {optionMenus.sections.map(option => (
            <span className="feed__filter-option">{option.label}</span>
          ))}
        </Fragment>
      </DocumentFilterDropdown>
      <div className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
        <i className="fas fa-search" />
        <a className="feed__filter-clear">CLEAR FILTERS</a>
      </div>
    </div>
  </div>
);

const mapState = (state, ownProps) => {
  return {
    optionMenus: getFilterOptionMenus(state)
  };
};

const actions = {};

export default connect(
  mapState,
  actions
)(DocumentFilter);
