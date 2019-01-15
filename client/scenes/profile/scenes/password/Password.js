import "./Password.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import { InputPassword } from "./../../../../components/index.js";
import Formsy from "formsy-react";

class ProfilePassword extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      hasPasswordUpdated: null
    };
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleSubmit({ currentPassword, newPassword }) {
    const { myUserId } = this.props;
    try {
      const res = await this.props.updateUserPassword(
        myUserId,
        currentPassword,
        newPassword
      );
      if (res.status === 200) {
        this.setState(prevState => ({
          currentPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
          hasPasswordUpdated: true
        }));
      }
    } catch (err) {
      this.setState({
        hasPasswordUpdated: false
      });
      console.log("error");
    }
  }

  componentDidMount() {
    this.setState({
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: ""
    });
  }

  renderUpdatePasswordResponse() {
    switch (this.state.hasPasswordUpdated) {
      case true:
        return (
          <div className="profile-password__response-text-success justify-content-center">
            Password has successfully been updated.
          </div>
        );
      case false:
        return (
          <div className="profile-password__response-text-error justify-content-center">
            The current password you provided is incorrect.
          </div>
        );
      default:
        break;
    }
  }

  render() {
    return (
      <div className="profile-subroute profile-password container">
        <Formsy
          onValidSubmit={model => this.handleSubmit(model)}
          name="updatePassword"
          onValid={this.enableButton}
          onInvalid={this.disableButton}
        >
          <div className="form-group row d-flex flex-column">
            <label htmlFor="currentPassword">
              <small>Current Password</small>
            </label>
            <InputPassword
              name="currentPassword"
              validations="minLength:8"
              validationError="Password must have a minimum length of 8 characters"
              required
            />
          </div>
          <div className="form-group row d-flex flex-column">
            <label htmlFor="newPassword">
              <small>Password</small>
            </label>
            <InputPassword
              name="newPassword"
              validations="minLength:8"
              validationError="Password must have a minimum length of 8 characters"
              required
            />
          </div>
          <div className="form-group row d-flex flex-column">
            <label htmlFor="newPassword">
              <small>Confirm password</small>
            </label>
            <InputPassword
              name="confirm"
              validations="equalsField:newPassword"
              validationError="Password and confirmation password do not match"
            />
          </div>
          {this.renderUpdatePasswordResponse()}
          <div className="form-group row auth-form__submit-btn-container justify-content-center">
            <button className="btn btn-outline-primary" type="submit">
              Change Password
            </button>
          </div>
        </Formsy>
      </div>
    );
  }
}

export default ProfilePassword;
