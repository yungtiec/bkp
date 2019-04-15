import "./SidebarLayout.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { AuthWidget } from "./index";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHighlights: true
    };
    autoBind(this);
  }

  render() {
    const {
      isLoggedIn,
      toggleSidebar,
      sidebarOpen,
      width,
      children,
      sidebarContext,
      toggleSidebarContext
    } = this.props;
    const style = sidebarOpen
      ? {
          marginLeft:
            width < 767 ? "-350px" : width > 1300 ? "-450px" : "-410px"
        }
      : {
          marginLeft: "-10px"
        };
    const sizeBtnAngle = sidebarOpen ? "right" : "left";
    const book = sidebarContext === "comments" ? "list-ul" : "arrow-left";
    const tabStyle = {
      width: width < 767 ? "348px" : width > 1300 ? "-448px" : "408px"
    };
    const showAuthWidget = sidebarOpen && isLoggedIn;

    return (
      <div className="sidebar" style={style}>
        <div className="annotation-coordinate__container" />
        <div className="sidebar__toolbar">
          {showAuthWidget && <AuthWidget dataTip={true} dataFor="auth-widget" />}
          {sidebarOpen && (
            <ReactTooltip id="auth-widget" type="dark">
              <span>Your profile</span>
            </ReactTooltip>
          )}
          <button
            data-tip
            data-for="hide-sidebar"
            className="social-toolbar__size-btn"
            onClick={() => toggleSidebar('comments')}
          >
            <i className={`fas fa-angle-${sizeBtnAngle}`} />
          </button>
          <ReactTooltip id="hide-sidebar" type="dark">
            <span>{sidebarOpen ? "Hide sidebar" : "Show sidebar"}</span>
          </ReactTooltip>
          {sidebarOpen &&
            toggleSidebarContext && (
              <button
                data-tip
                data-for="table-of-contents"
                className="social-toolbar__table-of-contents-btn"
                onClick={toggleSidebarContext}
              >
                <i className={`fas fa-${book}`} />
              </button>
            )}
          {sidebarOpen &&
            toggleSidebarContext && (
              <ReactTooltip id="table-of-contents" type="dark">
                <span>
                  {sidebarContext === "comments"
                    ? "Table of contents"
                    : "back to comments"}
                </span>
              </ReactTooltip>
            )}
        </div>
        <div>
          <div className="sidebar__logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default Sidebar;
