import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getFilterOptionMenus, getFilters } from "../data/reducer";
import { updateFilter, clearFilter } from "../data/actions";
import { Async } from "react-select";
import { FilterItem, FilterBar, FilterSearch } from "../../../components";
import { Link } from "react-router-dom";

const QuestionFilter = ({
  optionMenus,
  filters,
  updateFilter,
  clearFilter,
  screenWidth,
  marginClass,
  isAdmin
}) => {
  return (
    <FilterBar marginClass={marginClass}>
      <FilterItem
        screenWidth={screenWidth}
        icon="sort"
        filterLabel="sort by"
        filterKey="order"
        multi={false}
        selected={filters.order}
        options={optionMenus.order}
        updateFilter={updateFilter}
      />
      <FilterSearch
        clearFilter={clearFilter}
        updateFilter={updateFilter}
        value={filters.search}
      >
        {isAdmin ? (
          <Link
            className={`btn btn-primary ${screenWidth < 992 ? "ml-2" : "ml-4"}`}
            style={{ fontSize: "inherit" }}
            to="/requests-for-comment/create"
          >
            New request
          </Link>
        ) : null}
      </FilterSearch>
    </FilterBar>
  );
};

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    filters: getFilters(state),
    optionMenus: getFilterOptionMenus(state),
    screenWidth: state.data.environment.width,
    isAdmin:
      state.data.user.roles &&
      state.data.user.roles.filter(r => r.name === "admin").length
  };
};

const actions = {
  updateFilter,
  clearFilter
};

export default connect(
  mapState,
  actions
)(QuestionFilter);
