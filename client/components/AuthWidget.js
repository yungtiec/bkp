import "./AuthWidget.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { logout, currentUserIsAdmin } from "../data/reducer";
import ReactDOM from "react-dom";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../policies.js";

class AuthWidget extends Component {
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
    const {
      isLoggedIn,
      name,
      logout,
      inNavbar,
      width,
      isAdmin,
      user,
      dataTip,
      dataFor
    } = this.props;
    const className = inNavbar ? "auth-widget--navbar" : "auth-widget";
    const avatarColor = inNavbar ? "#459DF9" : "#ffffff";
    const avatarFgColor = inNavbar ? "#ffffff" : "#09263a";

    if (isLoggedIn)
      return (
        <div
          className={className}
          ref={this.setWrapperRef}
          data-tip={dataTip}
          data-for={dataFor}
        >
          <div className={`${className}__avatar-container`}>
            <Avatar
              name={name.trim() ? name : "?"}
              size={46}
              src={
                user.avatar_url ||
                "/assets/blank-avatar.png"
              }
              color={avatarColor}
              fgColor={avatarFgColor}
              onClick={this.toggleDropdown}
            />
          </div>
          {this.state.dropdown && (
            <div className={`${className}__dropdown`}>
              <Link
                to={`/profile/@${user.user_handle}`}
                style={{ display: "block", margin: "0px" }}
              >
                <div className={`${className}__dropdown-item`}>profile</div>
              </Link>
              {width < 600 && isAdmin ? (
                <Link to="/admin" style={{ display: "block", margin: "0px" }}>
                  <div className={`${className}__dropdown-item`}>admin</div>
                </Link>
              ) : (
                ""
              )}
              <a
                href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
                target="_blank"
                style={{ display: "block", margin: "0px" }}
              >
                <div className={`${className}__dropdown-item`}>telegram</div>
              </a>
              <a
                href="https://twitter.com/thebkp_official"
                target="_blank"
                style={{ display: "block", margin: "0px" }}
              >
                <div className={`${className}__dropdown-item`}>twitter</div>
              </a>
              {width < 1060 ? (
                <PunditContainer policies={policies} user={user}>
                  <PunditTypeSet type="Disclosure">
                    <VisibleIf action="Create" model={{}}>
                      <Link
                        to="/upload"
                        style={{ display: "block", margin: "0px" }}
                      >
                        <div className={`${className}__dropdown-item`}>
                          create
                        </div>
                      </Link>
                    </VisibleIf>
                  </PunditTypeSet>
                </PunditContainer>
              ) : (
                ""
              )}
              {width < 1060 ? (
                <PunditContainer policies={policies} user={user}>
                  <PunditTypeSet type="Disclosure">
                    <VisibleIf action="Create" model={{}}>
                      <Link
                        to="/recent-comments"
                        style={{ display: "block", margin: "0px" }}
                      >
                        <div className={`${className}__dropdown-item`}>
                          recent comments
                        </div>
                      </Link>
                    </VisibleIf>
                  </PunditTypeSet>
                </PunditContainer>
              ) : (
                ""
              )}
              <Link
                to={{
                  pathname: "/about",
                }}
                style={{ display: "block", margin: "0px" }}
              >
                <div className={`${className}__dropdown-item`}>about</div>
              </Link>
              <div
                className={`${className}__dropdown-item last`}
                onClick={logout}
              >
                logout
              </div>
            </div>
          )}
        </div>
      );
    else return (
      <div
        className={className}
        ref={this.setWrapperRef}
        data-tip={dataTip}
        data-for={dataFor}
      >
        <div className={`${className}__avatar-container`}>
          <i className="fa fa-bars" onClick={this.toggleDropdown} />
        </div>
        {this.state.dropdown && (
          <div className={`${className}__dropdown`}>
            <a
              href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
              target="_blank"
              style={{ display: "block", margin: "0px" }}
            >
              <div className={`${className}__dropdown-item`}>telegram</div>
            </a>
            <a
              href="https://twitter.com/thebkp_official"
              target="_blank"
              style={{ display: "block", margin: "0px" }}
            >
              <div className={`${className}__dropdown-item`}>twitter</div>
            </a>
            <Link
              to={{
                pathname: "/about",
              }}
              style={{ display: "block", margin: "0px" }}
            >
              <div className={`${className}__dropdown-item`}>about</div>
            </Link>
            <Link
              to={{
                pathname: "/login",
                state: { lastPath: this.props.lastPath }
              }}
              style={{ display: "block", margin: "0px" }}
            >
              <div className={`${className}__dropdown-item last`}>login</div>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapState = state => {
  const isLoggedIn = !!state.data.user.id;
  const name = isLoggedIn ? state.data.user.name : "";
  return {
    isLoggedIn,
    name,
    isAdmin: currentUserIsAdmin(state),
    width: state.data.environment.width,
    user: state.data.user
  };
};

const actions = {
  logout
};

export default connect(
  mapState,
  actions
)(AuthWidget);
