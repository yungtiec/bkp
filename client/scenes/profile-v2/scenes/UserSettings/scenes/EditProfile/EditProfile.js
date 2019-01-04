import "./EditProfile.scss";
import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FormsyInputEmail,
  FormsyInputText,
  FormsyTextArea
} from "../../../../../../components";
import Formsy from "formsy-react";

const FORMSY_INPUT_TYPE = {
  input: FormsyInputText,
  textarea: FormsyTextArea
};

const ProfileInput = ({ type, label, name, ...props }) => {
  const Input = FORMSY_INPUT_TYPE[type];
  return (
    <Fragment>
      <div className="mb-4 px-2 w-25 d-inline-block user-settings__input-label">
        <div className="mt-2">
          <label>{label}</label>
        </div>
      </div>
      <div className="mb-4 px-2 w-75 d-inline-block user-settings__input">
        <Input name={name} {...props} />
      </div>
    </Fragment>
  );
};

const EditProfile = ({ match, profile }) => {
  return (
    <div className="user-settings__edit-profile w-100 mt-5">
      <Formsy
        className="user-profile__form"
        onValidSubmit={model => {
          console.log(model);
        }}
        name="user-profile"
        onValid={() => {}}
        onInvalid={() => {}}
      >
        <div className=" d-flex w-100">
          <div className="w-50 pr-4">
            <ProfileInput
              type="input"
              label="Name"
              name="name"
              value={profile.name}
              required
            />
            <ProfileInput
              type="textarea"
              label="Self Introduction"
              name="self_introduction"
              value={profile.self_introduction}
            />
            <ProfileInput
              type="input"
              label="Organization"
              name="organization"
              value={profile.organization}
            />
            <ProfileInput type="input" label="Role" name="role" />
            <ProfileInput type="input" label="Location" name="location" />
          </div>
          <div className="w-50 pl-4">
            <ProfileInput
              type="input"
              label="LinkedIn"
              name="linkedin_url"
              value={profile.linkedin_url}
            />
            <ProfileInput
              type="input"
              label="Twitter"
              name="twitter_url"
              value={profile.twitter_url}
            />
            <ProfileInput
              type="input"
              label="Github"
              name="github_url"
              value={profile.github_url}
            />
            <ProfileInput
              type="input"
              label="Stack Overflow"
              name="stack-overflow_url"
              value={profile.stackoverflow_url}
            />
            <ProfileInput type="input" label="Website" name="website_url" />
          </div>
        </div>
        <div className="">
          <button className="btn btn-primary" type="submit">
            Save settings
          </button>
        </div>
      </Formsy>
    </div>
  );
};

export default withRouter(EditProfile);
