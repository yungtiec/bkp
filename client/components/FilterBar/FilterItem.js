import React, { Fragment } from "react";
import FilterDropdown from "./FilterDropdown";

const handleOptionOnClick = ({
  key,
  selected,
  currentValue,
  multi,
  updateFilter
}) => {
  if (!multi) {
    updateFilter({ key, value: selected });
    return;
  }
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

export default ({
  screenWidth,
  icon,
  filterLabel,
  filterKey,
  multi,
  selected,
  options,
  updateFilter
}) => (
  <Fragment>
    {filterLabel ? (
      <div className="feed__filter-item feed__filter-label">
        {screenWidth < 992 ? <i class={`fas fa-${icon}`} /> : filterLabel}
      </div>
    ) : null}
    <FilterDropdown
      name="order"
      label={
        multi
          ? !selected || (selected && !selected.length)
            ? "category"
            : selected.length === 1
            ? selected[0].label
            : `${selected[0].label} and ...`
          : selected.label
      }
      screenWidth={screenWidth}
    >
      <Fragment>
        {options.map(option => (
          <span
            className={`feed__filter-option ${
              (!multi && selected && selected.value === option.value) ||
              (multi &&
                selected &&
                selected.filter(s => s.value === option.value).length)
                ? "feed__filter-option--active"
                : ""
            }`}
            onClick={() =>
              handleOptionOnClick({
                key: filterKey,
                selected: option,
                currentValue: selected,
                multi,
                updateFilter
              })
            }
          >
            {option.label}
          </span>
        ))}
      </Fragment>
    </FilterDropdown>
  </Fragment>
);
