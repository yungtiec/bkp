import { withFormsy } from "formsy-react";
import React from "react";
import autoBind from "react-autobind";
import { isEmpty } from "lodash";

function createInputWithType(type) {
  class InputTemplate extends React.Component {
    constructor(props) {
      super(props);
      autoBind(this);
    }

    changeValue(event) {
      // setValue() will set the value of the component, which in
      // turn will validate it and the rest of the form
      // Important: Don't skip this step. This pattern is required
      // for Formsy to work.
      this.props.setValue(event.currentTarget.value, false);
      if (this.props.onChangeCallback)
        this.props.onChangeCallback(event.currentTarget.value);
    }

    validateValue(event) {
      this.props.setValue(event.currentTarget.value);
    }

    render() {
      // An error message is returned only if the component is invalid
      const errorMessage = this.props.getErrorMessage(),
        isPristine = this.props.isPristine(),
        isValid = this.props.isValid(),
        showRequired = this.props.showRequired(),
        showError = _.isBoolean(this.props.showError)
          ? this.props.showError
          : this.props.showError(),
        showRequiredMessage = !isPristine && !isValid && showRequired;

      console.log(this.props.name, this.props.getValue())

      return (
        <div style={{ margin: 0, width: "100%" }}>
          <input
            onChange={this.changeValue}
            onBlur={this.validateValue}
            type={type}
            className={`form-control ${showRequiredMessage &&
              "form-control--invalid"}`}
            value={this.props.getValue() || ""}
          />
          {!isEmpty(this.props.message) && (
            <div
              className={`text-${this.props.message.status} mr-2`}
              style={{ fontSize: "12px" }}
            >
              {this.props.message.text}
            </div>
          )}
          {showRequiredMessage && (
            <div className="text-danger mr-2" style={{ fontSize: "12px" }}>
              This is required
            </div>
          )}
          {errorMessage && (
            <div className="text-danger mr-2" style={{ fontSize: "12px" }}>
              {errorMessage}
            </div>
          )}
        </div>
      );
    }
  }
  return withFormsy(InputTemplate);
}

export const FormsyInputEmail = createInputWithType("email");
export const FormsyInputPassword = createInputWithType("password");
export const FormsyInputText = createInputWithType("text");
