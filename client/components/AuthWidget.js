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
              color={avatarColor}
              fgColor={avatarFgColor}
              onClick={this.toggleDropdown}
            />
          </div>
          {this.state.dropdown && (
            <div className={`${className}__dropdown`}>
              <Link
                to="/user/profile/about"
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
              {width < 600 ? (
                <Link
                  to="/project/BKP/document/1/version/2"
                  style={{ display: "block", margin: "0px" }}
                >
                  <div className={`${className}__dropdown-item`}>framework</div>
                </Link>
              ) : (
                ""
              )}
              {width < 600 ? (
                <Link
                  to="/project/CVL/document/2/version/3"
                  style={{ display: "block", margin: "0px" }}
                >
                  <div className={`${className}__dropdown-item`}>Civil Scorecard</div>
                </Link>
              ) : (
                ""
              )}
              {width < 600 ? (
                <a
                  href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
                  target="_blank"
                  style={{ display: "block", margin: "0px" }}
                >
                  <div className={`${className}__dropdown-item`}>discuss</div>
                </a>
              ) : (
                ""
              )}
              {width < 600 && isAdmin ? (
                <Link
                  to="/activity-board"
                  style={{ display: "block", margin: "0px" }}
                >
                  <div className={`${className}__dropdown-item`}>
                    activity board
                  </div>
                </Link>
              ) : (
                ""
              )}
              {width < 970 ? (
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
              {width < 970 ? (
                <PunditContainer policies={policies} user={user}>
                  <PunditTypeSet type="Disclosure">
                    <VisibleIf action="Create" model={{}}>
                      <Link
                        to="/dashboard"
                        style={{ display: "block", margin: "0px" }}
                      >
                        <div className={`${className}__dropdown-item`}>
                          dashboard
                        </div>
                      </Link>
                    </VisibleIf>
                  </PunditTypeSet>
                </PunditContainer>
              ) : (
                ""
              )}
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
    else return <div />;
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

export default connect(mapState, actions)(AuthWidget);
