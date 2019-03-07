import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";

export default class FilterDropdown extends Component {
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
        dropdown: false,
        offset: null
      });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
    if (node) this.checkHorizontallyBound();
  }

  checkHorizontallyBound() {
    var windowWidth = $(window).width();
    var left =
      !this.state.left ||
      (this.state.left &&
        this.state.windowWidth &&
        this.state.windowWidth !== windowWidth)
        ? $(this.wrapperRef).offset().left
        : this.state.left;
    var width = $(this.wrapperRef).outerWidth();
    if (left + width > windowWidth)
      this.setState({ windowWidth, left, offset: left + width - windowWidth });
    else this.setState({ offset: null });
  }

  render() {
    const { name, label, filter, children } = this.props;

    return (
      <Fragment>
        <div className="feed__filter-item" onClick={this.toggleDropdown}>
          {label}
          {this.state.dropdown ? (
            <div
              className={`feed__filter-dropdown feed__filter-dropdown-${name}`}
              ref={this.setWrapperRef}
              style={this.state.offset ? { left: -this.state.offset } : {}}
            >
              {children}
            </div>
          ) : null}
        </div>
      </Fragment>
    );
  }
}
