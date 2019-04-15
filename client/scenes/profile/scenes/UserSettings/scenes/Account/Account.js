import "./Account.scss";
import React, { Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Formsy from "formsy-react";
import { InlineInputGrid } from "../../../../../../components";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userHandleRequestMessage: {}
    };
  }

  render() {
    const {
      match,
      profile,
      updateAccount,
      updateUserPassword,
      signinWithUport,
      screenWidth
    } = this.props;

    return (
      <div className="user-settings__edit-account w-100 mt-3">
        <div className=" d-flex w-100 justify-content-center">
          <div className={`${screenWidth > 992 ? "w-50" : "w-100"}`}>
            <Formsy
              onValidSubmit={updateAccount}
              name="user-account"
              onValid={() => {}}
              onInvalid={() => {}}
            >
              <div className="user-account__fieldset-header">
                <h6 className="font-weight-bold mb-0">Account</h6>
              </div>
              <div className="user-account__fieldset">
                <InlineInputGrid
                  type="email"
                  label="Email"
                  name="email"
                  value={profile.email}
                  validations="isEmail"
                  validationError="Please provide a valid email."
                  required
                />
                <InlineInputGrid
                  type="input"
                  label="User handle"
                  name="user_handle"
                  value={profile.user_handle}
                  onChangeCallback={newHandle => {
                    return axios
                      .get(
                        `/api/users/${
                          profile.user_handle
                        }/check-handle?q=${newHandle}`
                      )
                      .then(res => {
                        if (res.data && res.data.id !== profile.id)
                          this.setState({
                            userHandleRequestMessage: {
                              status: "danger",
                              text: "this handle has been taken."
                            }
                          });
                        else if (res.data && res.data.id === profile.id)
                          this.setState({ userHandleRequestMessage: {} });
                        else
                          this.setState({
                            userHandleRequestMessage: {
                              status: "success",
                              text: `${
                                window.location.host
                              }/profile/@${newHandle}`
                            }
                          });
                      });
                  }}
                  message={this.state.userHandleRequestMessage}
                  toLowercase={true}
                  required
                />
                <div className="px-1">
                  <button type="submit" className="btn btn-outline-primary">
                    Submit
                  </button>
                </div>
              </div>
            </Formsy>
            <Formsy
              onValidSubmit={updateUserPassword}
              name="user-password"
              onValid={() => {}}
              onInvalid={() => {}}
            >
              <div className="user-account__fieldset-header">
                <h6 className="font-weight-bold mb-0">Password</h6>
              </div>
              <div className="user-account__fieldset">
                <InlineInputGrid
                  type="password"
                  label="Current Password"
                  name="password"
                  value=""
                  message={{
                    status: "primary",
                    text: (
                      <Link to="/request-password-reset">
                        forget password? or don't have password set up yet?
                      </Link>
                    )
                  }}
                  required
                />
                <InlineInputGrid
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value=""
                  required
                />
                <InlineInputGrid
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value=""
                  validations="equalsField:newPassword"
                  validationError="Please make sure your passwords match."
                  required
                />
                <div className="px-1">
                  <button type="submit" className="btn btn-outline-primary">
                    Submit
                  </button>
                </div>
              </div>
            </Formsy>
            <div className="user-account__fieldset-header">
              <h6 className="font-weight-bold mb-0">Connect accounts</h6>
            </div>
            <div className="user-account__fieldset">
              {profile.googleConnected ? (
                <div className="mb-2 px-2">
                  <p className="mb-0">You're logged in using Google</p>
                </div>
              ) : (
                <a
                  className="mb-2 px-1 d-block"
                  href={`/auth/google?state=${encodeURI(
                    window.location.pathname
                  )}`}
                >
                  <img
                    width="191px"
                    height="46px"
                    src="/assets/btn_google_signin_dark_normal_web.png"
                  />
                </a>
              )}
              {profile.uportConnected ? (
                <div className="mb-2 px-2">
                  <p className="mb-0">You're logged in using Uport</p>
                </div>
              ) : (
                <a className="mb-2 px-1 d-block" onClick={signinWithUport}>
                  <img
                    width="191px"
                    height="46px"
                    src="/assets/btn_uport_signin_dark_normal_web.png"
                  />
                </a>
              )}
              {profile.githubConnected ? (
                <div className="mb-2 px-2">
                  <p className="mb-0">You're logged in using Github</p>
                </div>
              ) : (
                <a
                  className="mb-2 px-1 d-block"
                  href={`/auth/github?state=${encodeURI(
                    window.location.pathname
                  )}`}
                >
                  <img
                    width="185px"
                    height="45px"
                    style={{ marginLeft: "3px" }}
                    src="/assets/btn-github-dark.png"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Account);
