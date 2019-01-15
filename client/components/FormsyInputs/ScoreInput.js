import "./ScoreInput.scss";
import { withFormsy } from "formsy-react";
import React from "react";
import autoBind from "react-autobind";

class ScoreInput extends React.Component {
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
      <div className="score-input__container">
        <div
          className={`${
            this.props.label
              ? "d-flex justify-content-between align-items-start score-input__div"
              : ""
          }`}
          style={this.props.zeroMargin ? { margin: 0 } : {}}
        >
          {this.props.label ? (
            <div className="d-flex flex-column mx-0">
              <span>{this.props.label}</span>
              <span className="text-danger score-input__error">
                {errorMessage}
              </span>
            </div>
          ) : null}
          <input
            className="score-input"
            onChange={this.changeValue}
            onBlur={this.validateValue}
            type="Number"
            style={this.props.zeroMargin ? { margin: 0 } : {}}
            value={this.props.getValue() || ""}
          />
        </div>
      </div>
    );
  }
}
export default withFormsy(ScoreInput);
