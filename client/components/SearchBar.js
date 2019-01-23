import "./SearchBar.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSearchInputOnChange(event) {
  }

  render() {
    return (
      <div className="box--search">
        <div className="box--left">
          <input
            type="text"
            onChange={this.handleSearchInputOnChange}
            placeholder="SEARCH FOR COMPANY OR TOKEN"
            className="header__search-input"
            value=""
          />
        </div>
        <div className="box--right">
          <div className="icon-container">
            <i className="fas fa-times" />
          </div>
        </div>
      </div>
    );
  }
}
