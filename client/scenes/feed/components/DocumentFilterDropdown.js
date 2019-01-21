import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";

export default class DocumentFilterDropdown extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      dropdown: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  toggleDropdown() {
    const { dropdown } = this.state;
    this.setState({
      dropdown: !dropdown
    });
  }

  handleClickOutside(evt) {
    if (this.wrapperRef && !this.wrapperRef.contains(evt.target))
      this.setState({
        dropdown: false
      });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    const { name, label, filter, children } = this.props;
    return (
      <Fragment>
        <div className="feed__filter-item" onClick={this.toggleDropdown}>
          {label}
          {this.state.dropdown ? (
            <div className="feed__filter-dropdown" ref={this.setWrapperRef}>
              {children}
            </div>
          ) : null}
        </div>
      </Fragment>
    );
  }
}
