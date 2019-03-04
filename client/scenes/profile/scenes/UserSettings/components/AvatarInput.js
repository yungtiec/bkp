import "./AvatarInput.scss";
import React, { Fragment } from "react";
import Formsy from "formsy-react";
import { FormsyImageUpload } from "../../../../../components";
import Avatar from "react-avatar";

const AvatarInput = ({ nameOfUser, name, avatarUrl, ...props }) => (
  <div className="d-flex">
    <Avatar
      className="user-settings__avatar-input-preview"
      size={42}
      src={avatarUrl || "/assets/blank-avatar.png"}
      color={"#459DF9"}
      fgColor={"#ffffff"}
    />
    <div className="user-settings__avatar-input-container">
      <FormsyImageUpload
        name={name}
        inputClassname="user-settings__avatar-input"
        {...props}
      />
    </div>
  </div>
);

export default AvatarInput;
