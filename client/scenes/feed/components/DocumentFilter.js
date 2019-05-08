import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getFilterOptionMenus, getFilters } from "../data/reducer";
import { updateFilter, clearFilter } from "../data/actions";
import { Async } from "react-select";
import { FilterItem, FilterBar, FilterSearch, FilterByTags } from "../../../components";

const DocumentFilter = ({
  optionMenus,
  filters,
  updateFilter,
  clearFilter,
  screenWidth,
  marginClass
}) => (
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
    <FilterByTags
      screenWidth={screenWidth}
      searchByTags={filters.searchByTags}
      updateFilter={updateFilter}
    />
    <FilterSearch
      screenWidth={screenWidth}
      clearFilter={clearFilter}
      updateFilter={updateFilter}
      searchByTags={filters.searchByTags}
      value={filters.search || filters.tags}
    />
  </FilterBar>
);

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    filters: getFilters(state),
    optionMenus: getFilterOptionMenus(state),
    screenWidth: state.data.environment.width
  };
};

const actions = {
  updateFilter,
  clearFilter
};

export default connect(
  mapState,
  actions
)(DocumentFilter);
