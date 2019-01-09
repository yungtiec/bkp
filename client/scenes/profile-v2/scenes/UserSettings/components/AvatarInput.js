import "./AvatarInput.scss";
import React, { Fragment } from "react";
import Formsy from "formsy-react";
import { FormsyInputFile } from "../../../../../components";

const AvatarInput = ({ name, avatarUrl, ...props }) => (
  <div className="d-flex">
    {avatarUrl && (
      <img
        className="user-settings__avatar-input-preview"
        width="43"
        height="43"
        src={avatarUrl}
      />
    )}
    <div className="user-settings__avatar-input-container">
      <FormsyInputFile
        name={name}
        inputClassname="user-settings__avatar-input"
        {...props}
      />
    </div>
  </div>
);

export default AvatarInput;
