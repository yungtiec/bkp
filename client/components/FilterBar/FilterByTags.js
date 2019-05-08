import React, { Fragment } from "react";

export default ({screenWidth, searchByTags, updateFilter}) => (
  <Fragment>
    <div className="feed__filter-item feed__filter-label">
      {screenWidth < 992 ? <i className={`fas fa-filter`}/> : 'search by'}
    </div>
    <div className="feed__filter-item">
      Tags
      <input
        name="hasAnnotator"
        style={{'margin-left' : '10px'}}
        type="checkbox"
        checked={searchByTags}
        onChange={() => updateFilter({key : "searchByTags", value : !searchByTags})}
      />
    </div>
  </Fragment>
);
