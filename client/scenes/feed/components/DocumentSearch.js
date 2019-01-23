import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";

export default class DocumentSearch extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      enabled: false
    };
  }

  render() {
    const { updateFilter, clearFilter, search } = this.props;

    return this.state.enabled ? (
      <div className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="SEARCH"
          className="feed__filter-search-input"
          onChange={e => updateFilter({ key: "search", value: e.target.value })}
          value={search}
          ref={input => {
            this.searchInput = input;
          }}
        />
        <a className="feed__filter-clear" onClick={() => clearFilter()}>
          CLEAR FILTERS
        </a>
      </div>
    ) : (
      <div
        className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center"
        onClick={() => {
          this.setState({ enabled: true });
          setTimeout(() => this.searchInput.focus(), 300);
        }}
      >
        <i className="fas fa-search" />
        <a className="feed__filter-clear" onClick={() => clearFilter()}>
          CLEAR FILTERS
        </a>
      </div>
    );
  }
}
