import React, { Fragment } from "react";
import DocumentFilterDropdown from "./DocumentFilterDropdown";
import DocumentSearch from "./DocumentSearch";
import { connect } from "react-redux";
import { getFilterOptionMenus, getFilters } from "../data/reducer";
import { updateFilter, clearFilter } from "../data/actions";
import { Async } from "react-select";

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

const getTags = async (input, callback) => {
  input = input.toLowerCase();
  var tags = await axios
    .get("/api/tags/autocomplete", {
      params: { term: input }
    })
    .then(res => res.data);
  return { options: tags };
};

const DocumentFilter = ({
  optionMenus,
  filters,
  updateFilter,
  clearFilter,
  screenWidth
}) => (
  <div className="feed__filter-container my-5">
    <div className="feed__filter d-flex">
      <div className="feed__filter-item feed__filter-label">
        {screenWidth < 992 ? <i class="fas fa-sort" /> : "sort by"}
      </div>
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
      <div className="feed__filter-item feed__filter-label ">
        {screenWidth < 992 ? <i class="fas fa-filter" /> : "filter by"}
      </div>
      <DocumentFilterDropdown
        name="category"
        label={
          !filters.category || (filters.category && !filters.category.length)
            ? "category"
            : filters.category.length === 1
            ? filters.category[0].label
            : `${filters.category[0].label} and ...`
        }
      >
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
          <span
            className={`feed__filter-option`}
            onClick={() => clearFilter("category")}
          >
            clear
          </span>
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
