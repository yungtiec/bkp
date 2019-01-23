import React, { Fragment } from "react";
import DocumentFilterDropdown from "./DocumentFilterDropdown";
import DocumentSearch from "./DocumentSearch";
import { connect } from "react-redux";
import { getFilterOptionMenus, getFilters } from "../data/reducer";
import { updateFilter, clearFilter } from "../data/actions";

const handleMultiOptionOnClick = ({
  key,
  selected,
  currentValue,
  updateFilter
}) => {
  if (!currentValue) {
    updateFilter({ key, value: [selected] });
  } else if (currentValue.filter(s => s.value === selected.value).length) {
    updateFilter({
      key,
      value: currentValue.filter(s => s.value !== selected.value)
    });
  } else {
    updateFilter({ key, value: currentValue.concat(selected) });
  }
};

const handleOptionOnClick = ({ key, selected, updateFilter }) => {
  updateFilter({ key, value: selected });
};

const DocumentFilter = ({
  optionMenus,
  filters,
  updateFilter,
  clearFilter
}) => (
  <div className="feed__filter-container my-5">
    <div className="feed__filter d-flex">
      <div className="feed__filter-item feed__filter-label">sort by</div>
      <DocumentFilterDropdown name="order" label={filters.order.label}>
        <Fragment>
          {optionMenus.order.map(option => (
            <span
              className={`feed__filter-option ${filters.order &&
                filters.order.value === option.value &&
                "feed__filter-option--active"}`}
              onClick={() =>
                handleOptionOnClick({
                  key: "order",
                  selected: option,
                  updateFilter
                })
              }
            >
              {option.label}
            </span>
          ))}
        </Fragment>
      </DocumentFilterDropdown>
      <div className="feed__filter-item feed__filter-label">filter by</div>
      <DocumentFilterDropdown name="category" label="category">
        <Fragment>
          {optionMenus.category.map(option => (
            <span
              className={`feed__filter-option ${filters.category &&
                filters.category.filter(s => s.value === option.value).length &&
                "feed__filter-option--active"}`}
              onClick={() =>
                handleMultiOptionOnClick({
                  key: "category",
                  selected: option,
                  currentValue: filters.category,
                  updateFilter
                })
              }
            >
              {option.label}
            </span>
          ))}
        </Fragment>
      </DocumentFilterDropdown>
      <DocumentSearch
        clearFilter={clearFilter}
        updateFilter={updateFilter}
        search={filters.search}
      />
    </div>
  </div>
);

const mapState = (state, ownProps) => {
  return {
    filters: getFilters(state),
    optionMenus: getFilterOptionMenus(state)
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
