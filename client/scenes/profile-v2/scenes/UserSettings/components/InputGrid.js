import React, { Fragment } from "react";
import Formsy from "formsy-react";
import {
  FormsyInputEmail,
  FormsyInputPassword,
  FormsyInputText,
  FormsyTextArea,
  FormsyAsyncSelect
} from "../../../../../components";

const FORMSY_INPUT_TYPE = {
  input: FormsyInputText,
  password: FormsyInputPassword,
  email: FormsyInputEmail,
  textarea: FormsyTextArea,
  asyncSelect: FormsyAsyncSelect
};

const InputGrid = ({ type, label, name, ...props }) => {
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

export default InputGrid;
