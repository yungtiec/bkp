import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import {DebounceInput} from "react-debounce-input";
import $ from "jquery";

export default class FilterSearch extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      enabled : false,
      searchTags: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(evt) {
    if (this.wrapperRef && !this.wrapperRef.contains(evt.target))
      this.setState({
        enabled : false
      });
  }

  render() {
    const {updateFilter, clearFilter, value, children, searchByTags} = this.props;

    return (
      <div className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
        <div className="feed__filter-item">
          Tags
          <input
            name="hasAnnotator"
            style={{'margin-left': '10px'}}
            type="checkbox"
            checked={searchByTags}
            onChange={() => updateFilter({key : "searchByTags", value : !searchByTags})}
          />
        </div>
        {this.state.enabled || value ? (
          <div className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
            <div
              className="d-flex justify-content-between align-items-center w-100"
              ref={this.setWrapperRef}
            >
              <DebounceInput
                minLength={3}
                debounceTimeout={500}
                type="text"
                placeholder="SEARCH"
                className="feed__filter-search-input"
                onChange={e => updateFilter({key : "search", value : e.target.value})}
                value={value}
                ref={input => {
                  this.searchInput = input;
                }}
              />
              <a className="feed__filter-clear" onClick={() => clearFilter()}>
                CLEAR FILTERS
              </a>
            </div>
          </div>
        ) : (
          <div className="feed__filter-item feed__filter-search d-flex justify-content-between align-items-center">
            <div
              className="d-flex justify-content-between align-items-center w-100"
              onClick={() => {
                this.setState({enabled : true});
                setTimeout(
                  () => ReactDOM.findDOMNode(this.searchInput).focus(),
                  300
                );
              }}
            >
              <i className="fas fa-search"/>

              <a className="feed__filter-clear" onClick={() => clearFilter()}>
                CLEAR FILTERS
              </a>
            </div>
            {children}
          </div>
        )}
      </div>
    )
  }
}
