import "./wizard.scss";
import React, { Component } from "react";
import WizardStep from "./components/WizardStep";
import { withRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { fetchStepArrayAndSchemas } from "./data/actions";
import { getStepArrayAndSchemas } from "./data/reducer";
import { loadModal, hideModal } from "../../data/reducer";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import Steps, { Step } from "rc-steps";

class Wizard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    // hardcode wizardSchemaId for now
    this.props.fetchStepArrayAndSchemas(1);
  }

  loadPreviewModa() {
    this.props.loadModal("WIZARD_DOCUMENT_PREVIEW_MODAL", {
      hideModal: this.props.hideModal,
      viewerStepArray: this.props.viewerStepArray,
      stepSchemas: this.props.stepSchemas,
      stepFormData: this.props.stepFormData
    });
  }

  render() {
    const {
      wizardStepArray,
      stepArray,
      stepSchemas,
      stepFormData,
      match,
      document,
      version
    } = this.props;
    console.log({ stepArray });
    const currentStep = Number(
      window.location.pathname.split("/").slice(-1)[0]
    );
    if (!stepSchemas || !stepSchemas) return null;
    return (
      <div className="main-container">
        <Steps
          className="wizard-steps py-3 mb-5"
          current={currentStep}
          labelPlacement="vertical"
        >
          {wizardStepArray.map((step, i) => (
            <Step
              title={step.title}
              description=""
              status={
                i + 1 === currentStep
                  ? "process"
                  : i + 1 >= currentStep
                    ? "wait"
                    : "finish"
              }
            />
          ))}
        </Steps>
        <button
          className="btn btn-outline-primary"
          onClick={this.loadPreviewModa}
          style={{ float: "right" }}
        >
          Preview
        </button>
        <Switch>
          {wizardStepArray.map((step, i) => (
            <Route
              key={`wizard-steps__${i + 1}`}
              path={`${match.path}/step/${i + 1}`}
              render={props => (
                <WizardStep
                  {...step}
                  stepNum={i + 1}
                  numStep={wizardStepArray.length}
                  jsonSchema={stepSchemas[step.id]}
                  formData={stepFormData[step.id]}
                  document={document}
                  version={version}
                />
              )}
            />
          ))}
          <Redirect to={`${match.path}/step/1`} />
        </Switch>
      </div>
    );
  }
}

const mapState = state => {
  const {
    stepArray,
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData,
    document,
    version
  } = getStepArrayAndSchemas(state);

  return {
    stepArray,
    viewerStepArray,
    wizardStepArray,
    stepSchemas,
    stepFormData,
    document,
    version
  };
};

const actions = { fetchStepArrayAndSchemas, loadModal, hideModal };

export default withRouter(
  connect(
    mapState,
    actions
  )(Wizard)
);
