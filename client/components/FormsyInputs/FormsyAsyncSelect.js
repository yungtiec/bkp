import "./FormsyAsyncSelect.scss";
import { withFormsy } from "formsy-react";
import React from "react";
import autoBind from "react-autobind";
import { Async } from "react-select";

class FormsyAsyncSelect extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  changeValue(option) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    var value = (this.props.getValue() || []).concat(option);
    this.props.setValue(value, false);
  }

  removeValue(target) {
    var value = (this.props.getValue() || []).filter(
      option => option.value !== target.value
    );
    this.props.setValue(value, false);
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
    const value = this.props.getValue() || [];

    return (
      <div className="m-0 w-100">
        <Async
          loadOptions={this.props.loadOptions}
          onChange={this.changeValue}
          value={[]}
          multi={this.props.multi}
        />
        {value.length && this.props.multi ? (
          <div className="mt-2">
            {value.map(option => (
              <div className="select-tag-chip">
                <span>{option.label}</span>
                <a className="ml-2" onClick={() => this.removeValue(option)}>x</a>
              </div>
            ))}
          </div>
        ) : null}
        {showRequired && (
          <span className="text-danger" style={{ fontSize: "12px" }}>
            This is required
          </span>
        )}
        <span className="text-danger" style={{ fontSize: "12px" }}>
          {errorMessage}
        </span>
      </div>
    );
  }
}
export default withFormsy(FormsyAsyncSelect);
