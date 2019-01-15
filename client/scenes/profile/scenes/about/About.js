import "./About.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";

class ProfileAbout extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(evt) {
    this.props.editProfile({ ...this.state, id: this.props.id });
    this.setState(prevState => ({
      edit: !prevState.edit
    }));
  }

  componentDidMount() {
    this.setState({
      edit: this.props.location.state && this.props.location.state.edit,
      firstName: this.props.first_name,
      lastName: this.props.last_name,
      name: this.props.name,
      organization: this.props.organization
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.setState({
        edit: nextProps.location.state && nextProps.location.state.edit,
        firstName: nextProps.first_name,
        lastName: nextProps.last_name,
        name: nextProps.name,
        organization: nextProps.organization
      });
    }
  }

  render() {
    return (
      <div className="profile-subroute container">
        {this.props.restricted_access && (
          <div className="profile-about__restricted-access">
            <span className="badge badge-danger">Restricted Access</span>
            <p>
              Due to your recent activities, admin has revoke your comment
              privilege.
            </p>
          </div>
        )}
        {!this.props.name ||
          (!this.props.name.trim() && (
            <div className="profile-about__restricted-access">
              <p className="text-center mt-3 text-danger">
                Please fill in your name.
              </p>
            </div>
          ))}
        <div className="profile-about__field">
          <span>
            <input
              name="anonymous"
              type="checkbox"
              checked={this.props.anonymity}
              onChange={this.props.changeAnonymity}
              className="mr-2 mb-3"
            />Stay anonymous
          </span>
        </div>
        <div className="profile-about__field">
          <span className="profile-about__field-label">Email</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                type="text"
                disabled
                name="email"
                value={this.props.email || ""}
              />
            </div>
          </div>
        </div>
        <div className="profile-about__field">
          <span className="profile-about__field-label">Name</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                ref={input => (this.firstInput = input)}
                type="text"
                disabled={!this.state.edit}
                onChange={this.handleChange}
                name="name"
                value={this.state.name || ""}
              />
            </div>
          </div>
        </div>
        <div className="profile-about__field">
          <span className="profile-about__field-label">Organization</span>
          <div className="profile-about__field-value">
            <div className="profile-about__input-container">
              <input
                type="text"
                disabled={!this.state.edit}
                onChange={this.handleChange}
                name="organization"
                value={this.state.organization || ""}
              />
            </div>
          </div>
        </div>
        {this.props.isMyProfile ? (
          <div className="profile-about__field justify-content-center">
            {this.state.edit ? (
              <button
                type="button"
                className="btn btn-primary  mt-4 btn-lg"
                onClick={this.handleSubmit}
              >
                save changes
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary  mt-4 btn-lg"
                onClick={() => {
                  this.firstInput.focus();
                  this.setState(prevState => ({
                    edit: !prevState.edit
                  }));
                }}
              >
                edit
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ProfileAbout;
