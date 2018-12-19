import "./index.scss";
import React, { Component } from "react";
import axios from "axios";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  auth,
  signinWithUport,
  requestPasswordReset,
  resetPassword,
  verifyUportOnMobile
} from "../../data/reducer";
import { Link } from "react-router-dom";
import { InputEmail, InputPassword, InputText } from "../index";
import Formsy from "formsy-react";

/**
 * COMPONENT
 */
class AuthForm extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = { canSubmit: false };
  }

  componentDidMount() {
    if (
      this.props.location.state &&
      this.props.location.state.lastPath &&
      (this.props.location.state.lastPath !== "/login" ||
        this.props.location.state.lastPath !== "/signup")
    ) {
      axios
        .post("/auth/uport/auth-redirect-path", {
          authRedirectPath: this.props.location.state.lastPath
        })
        .catch(err => console.log(err));
    }
    if (window.location.href.split("access_token=").length > 1) {
      this.props.verifyUportOnMobile(
        window.location.href.split("access_token=")[1]
      );
    }
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  handleSubmit(authMethod, model) {
    const email = model.email;
    const password = model.password;
    if (authMethod === "requestPasswordReset") {
      this.props.requestPasswordReset(email);
    } else if (authMethod === "resetPassword") {
      this.props.resetPassword({
        password,
        token: this.props.match.params.token
      });
    } else {
      var userInfo =
        authMethod === "login"
          ? { email, password }
          : {
              email,
              password,
              first_name: model.firstName,
              last_name: model.lastName,
              organization: model.organization
            };
      this.props.auth(userInfo, authMethod);
    }
  }

  renderAuthenticationForm() {
    const {
      authMethod,
      authMethodLabel,
      handleSubmit,
      error,
      signinWithUport
    } = this.props;

    return (
      <Formsy
        className="auth__form"
        onValidSubmit={model => this.handleSubmit(authMethod, model)}
        name={authMethod}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <div className="d-flex oauth-btns flex-md-row flex-column">
          <a
            href={`/auth/google?state=${encodeURI("/")}`}
          >
            <img
              width="150px"
              height="40px"
              src="/assets/btn_google_signin_dark_normal_web.png"
            />
          </a>
          <a onClick={signinWithUport}>
            <img
              width="150px"
              height="40px"
              src="/assets/btn_uport_signin_dark_normal_web.png"
            />
          </a>
          <a
            href={`/auth/github?state=${encodeURI(
              this.props.location.state
                ? this.props.location.state.lastPath
                : "/landing"
            )}`}
            href={`/auth/github?state=${encodeURI("/")}`}
          >
            <img
              width="145px"
              height="39px"
              src="/assets/btn-github-dark.png" />
          </a>
        </div>
        <div
          className="d-flex justify-content-center"
          style={{ margin: "0px -30px 20px -30px;" }}
        >
          <div
            style={{
              border: "1px solid #c2c2c2",
              borderWidth: "0 0 1px 0",
              width: "45%",
              marginBottom: "10px"
            }}
          />
          <span style={{ marginTop: "4px" }}>or</span>
          <div
            style={{
              border: "1px solid #c2c2c2",
              borderWidth: "0 0 1px 0",
              width: "45%",
              marginBottom: "10px"
            }}
          />
        </div>
        {authMethod === "signup" && (
          <div className="form-group row">
            <div style={{ margin: "0 1% 0 0", width: "49%" }}>
              <label htmlFor="firstName">
                <small>First Name</small>
              </label>
              <InputText name="firstName" required />
            </div>
            <div style={{ margin: "0 0 0 1%", width: "49%" }}>
              <label htmlFor="lastName">
                <small>Last Name</small>
              </label>
              <InputText name="lastName" required />
            </div>
          </div>
        )}
        {authMethod === "signup" && (
          <div className="form-group row d-flex flex-column">
            <label htmlFor="organization">
              <small>Organization</small>
            </label>
            <InputText name="organization" />
          </div>
        )}
        <div className="form-group row d-flex flex-column">
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <InputEmail
            name="email"
            validations="isEmail"
            validationError="This is not a valid email"
            required
          />
        </div>
        <div className="form-group row d-flex flex-column">
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <InputPassword
            name="password"
            validations="minLength:8"
            validationError="Password must have a minimum length of 8 characters"
            required
          />
        </div>
        {authMethod === "login" ? (
          <Link to="/request-password-reset" className="row">
            forget password?
          </Link>
        ) : null}
        {authMethod === "signup" && (
          <div className="form-group row d-flex flex-column">
            <label htmlFor="password">
              <small>Confirm password</small>
            </label>
            <InputPassword
              name="confirm"
              validations="equalsField:password"
              validationError="Password and confirmation password do not match"
            />
          </div>
        )}
        <div className="form-group row auth-form__submit-btn-container">
          <button className="btn btn-outline-primary" type="submit">
            {authMethodLabel}
          </button>
        </div>
        {error && error.response && <div>{error.response.data}</div>}
      </Formsy>
    );
  }

  renderRequestPasswordResetForm() {
    const { authMethod, authMethodLabel, handleSubmit } = this.props;
    return (
      <Formsy
        className="auth__form"
        onValidSubmit={model => this.handleSubmit(authMethod, model)}
        name={authMethod}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <div className="form-group row d-flex flex-column">
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <InputEmail
            name="email"
            validations="isEmail"
            validationError="This is not a valid email"
            required
          />
        </div>
        <div className="form-group row auth-form__submit-btn-container">
          <button className="btn btn-outline-primary" type="submit">
            {authMethodLabel}
          </button>
        </div>
      </Formsy>
    );
  }

  renderResetPasswordForm() {
    const { authMethod, authMethodLabel } = this.props;

    return (
      <Formsy
        className="auth__form"
        onValidSubmit={model => this.handleSubmit(authMethod, model)}
        name={authMethod}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        <div className="form-group row d-flex flex-column">
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <InputPassword
            name="password"
            validations="minLength:8"
            validationError="Password must have a minimum length of 8 characters"
            required
          />
        </div>
        <div className="form-group row d-flex flex-column">
          <label htmlFor="password">
            <small>Confirm password</small>
          </label>
          <InputPassword
            name="confirm"
            validations="equalsField:password"
            validationError="Password and confirmation password do not match"
          />
        </div>
        <div className="form-group row auth-form__submit-btn-container">
          <button className="btn btn-outline-primary" type="submit">
            {authMethodLabel}
          </button>
        </div>
      </Formsy>
    );
  }

  render() {
    const {
      authMethod,
      authMethodLabel,
      handleSubmit,
      error,
      signinWithUport
    } = this.props;

    return (
      <div className="auth-page">
        <div className="auth-page__header">
          <Link className="logo-tbp my-0 mx-0" to="/landing">
            <img
              width="120px"
              height="auto"
              className="logo__large"
              src="/assets/the-brooklyn-project-logo-white-transparent.png"
            />
          </Link>
        </div>
        <div className="auth__form-wrapper">
          <div className="auth__form-contents">
            {authMethod === "requestPasswordReset"
              ? this.renderRequestPasswordResetForm()
              : authMethod === "resetPassword"
                ? this.renderResetPasswordForm()
                : this.renderAuthenticationForm()}
          </div>
          <div className="auth-form__form-footer">
            <div className="auth-form__form-footer__left">
              <nav>
                <a
                  href="https://thebrooklynproject.consensys.net/"
                  target="_blank"
                  className="ml-0"
                >
                  <span>About</span>
                </a>
                <a
                  href="https://tinyurl.com/y94wspyg"
                  target="_blank"
                  style={{ width: "100px" }}
                >
                  <span>privacy policy</span>
                </a>
                <a
                  href="https://drive.google.com/open?id=1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV"
                  target="_blank"
                  style={{ width: "100px" }}
                >
                  <span>terms of use</span>
                </a>
              </nav>
            </div>
            <div className="auth-form__form-footer__right">
              <p id="no-acct-msg" className="message__has-account my-2">
                {authMethod === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <Link
                  className="btn__sign-in"
                  to={{
                    pathname: `/${
                      authMethod === "signup" ? "login" : "signup"
                    }`,
                    state: {
                      lastPath: this.props.location.state
                        ? this.props.location.state.lastPath
                        : "/landing"
                    }
                  }}
                >
                  {authMethod === "signup" ? "Log in" : "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="auth-page__footer">
          <div className="logo-consensys">
            <img
              width="100px"
              height="auto"
              className="logo__large"
              src="/assets/consensys-logo-white-transparent.png"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapLogin = state => {
  return {
    authMethod: "login",
    authMethodLabel: "Login",
    error: state.data.user.error
  };
};

const mapSignup = state => {
  return {
    authMethod: "signup",
    authMethodLabel: "Sign Up",
    error: state.data.user.error
  };
};

const mapRequestPasswordReset = state => {
  return {
    authMethod: "requestPasswordReset",
    authMethodLabel: "Request password reset"
  };
};

const mapResetPassword = state => {
  return {
    authMethod: "resetPassword",
    authMethodLabel: "Reset password"
  };
};

export const Login = withRouter(
  connect(
    mapLogin,
    { auth, signinWithUport, verifyUportOnMobile }
  )(AuthForm)
);
export const Signup = withRouter(
  connect(
    mapSignup,
    { auth, signinWithUport, verifyUportOnMobile }
  )(AuthForm)
);
export const RequestPasswordReset = connect(
  mapRequestPasswordReset,
  {
    requestPasswordReset
  }
)(AuthForm);
export const ResetPassword = withRouter(
  connect(
    mapResetPassword,
    { resetPassword }
  )(AuthForm)
);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  authMethod: PropTypes.string.isRequired,
  authMethodLabel: PropTypes.string.isRequired,
  error: PropTypes.object
};
