import { withFormsy } from "formsy-react";
import React from "react";
import autoBind from "react-autobind";

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
    }

    validateValue(event) {
      this.props.setValue(event.currentTarget.value);
    }

    render() {
      // An error message is returned only if the component is invalid
      var errorMessage = this.props.getErrorMessage();

      return (
        <div style={{ margin: 0, width: "100%" }}>
          <input
            onChange={this.changeValue}
            onBlur={this.validateValue}
            type={type}
            className="form-control"
            value={this.props.getValue() || ""}
          />
          <span className="text-danger" style={{ fontSize: "12px" }}>
            {errorMessage}
          </span>
        </div>
      );
    }
  }
  return withFormsy(InputTemplate);
}

export const InputEmail = createInputWithType("email");
export const InputPassword = createInputWithType("password");
export const InputText = createInputWithType("text");
