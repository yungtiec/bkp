import Formsy from "formsy-react";
import React from "react";

export default class FormsyWithConditionalBtn extends React.Component {
  constructor(props) {
    super(props);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.state = { canSubmit: false };
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  render() {
    return (
      <Formsy
        onValidSubmit={this.props.onValidSubmit}
        name={this.props.name}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
      >
        {this.props.children}
        {this.state.canSubmit ? (
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        ) : null}
      </Formsy>
    );
  }
}
