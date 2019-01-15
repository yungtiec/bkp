import React, { Component } from "react";
import autoBind from "react-autobind";
import Formsy from "formsy-react";
import { ScoreInput } from "./index";
import { addValidationRule } from "formsy-react";

addValidationRule("isWithin", function(values, value, range) {
  // The this context points to an object containing the values
  // {childAge: "", parentAge: "5"}
  // otherField argument is from the validations rule ("childAge")
  return Number(range[1]) >= Number(value) && Number(range[0]) <= Number(value);
});

export default class ProjectScorecardInputs extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleScorecardChange(currentValues, isChanged) {
    this.props.updateProjectScorecard(this.scorecard.getModel());
  }

  render() {
    const { scorecard } = this.props;
    const validations = "isWithin:[1, 10]";
    const validationError = "the score must be within 1 to 10";

    return (
      <Formsy
        ref={f => (this.scorecard = f)}
        className=""
        onChange={this.handleScorecardChange}
        name="project-scorecard__form"
      >
        <ScoreInput
          label="Consumer Token Design"
          name="consumer_token_design"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["consumer_token_design"]
              ? Number(scorecard["consumer_token_design"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Project Governance and Operation"
          name="project_governance_and_operation"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["project_governance_and_operation"]
              ? Number(scorecard["project_governance_and_operation"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Responsible Token Distribution"
          name="responsible_token_distribution"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["responsible_token_distribution"]
              ? Number(scorecard["responsible_token_distribution"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Use of Token Distribution Proceeds"
          name="use_of_token_distribution_proceeds"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["use_of_token_distribution_proceeds"]
              ? Number(scorecard["use_of_token_distribution_proceeds"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Token Inventory"
          name="token_inventory"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["token_inventory"]
              ? Number(scorecard["token_inventory"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Mitigation of Conflicts and Improper Trading"
          name="mitigation_of_conflicts_and_improper_trading"
          validations={validations}
          validationError={validationError}
          value={
            scorecard &&
            scorecard["mitigation_of_conflicts_and_improper_trading"]
              ? Number(
                  scorecard["mitigation_of_conflicts_and_improper_trading"]
                )
              : ""
          }
          required
        />
        <ScoreInput
          label="Token Safety and Security"
          name="token_safety_and_security"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["token_safety_and_security"]
              ? Number(scorecard["token_safety_and_security"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Marketing Practices"
          name="marketing_practices"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["marketing_practices"]
              ? Number(scorecard["marketing_practices"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Protecting and Empowering Consumers"
          name="protecting_and_empowering_consumers"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["protecting_and_empowering_consumers"]
              ? Number(scorecard["protecting_and_empowering_consumers"])
              : ""
          }
          required
        />
        <ScoreInput
          label="Compliance with Applicable Laws"
          name="compliance_with_application_laws"
          validations={validations}
          validationError={validationError}
          value={
            scorecard && scorecard["compliance_with_application_laws"]
              ? Number(scorecard["compliance_with_application_laws"])
              : ""
          }
          required
        />
      </Formsy>
    );
  }
}
