import "./EditProfile.scss";
import React, { Fragment } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { InputEmail, InputText } from "../../../../../../components";
import Formsy from "formsy-react";

const ProfileInput = ({ type, label }) => (
  <Fragment>
    <div className="mb-4 px-2 w-25 float-left user-settings__input-label">
      <div className="mt-2">
        <label>{label}</label>
      </div>
    </div>
    <div className="mb-4 px-2 w-75 float-right user-settings__input">
      <InputText name="name" />
    </div>
  </Fragment>
);

const EditProfile = ({ match, profile }) => {
  return (
    <div className="user-settings__edit-profile w-100 mt-4">
      <Formsy
        className="user-profile__form  d-flex w-100"
        onValidSubmit={model => {}}
        name="user-profile"
        onValid={() => {}}
        onInvalid={() => {}}
      >
        <div className="w-50 pr-4">
          <ProfileInput label="Name" />
          <ProfileInput label="User handle" />
          <ProfileInput label="Self Introduction" />
          <ProfileInput label="Organization" />
          <ProfileInput label="Role" />
          <ProfileInput label="Location" />
        </div>
        <div className="w-50">links</div>
      </Formsy>
    </div>
  );
};

export default withRouter(EditProfile);
