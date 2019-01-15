import React, { Component } from "react";
import { Element } from "react-scroll";
import { keys, capitalize, isEqual } from "lodash";
import autoBind from "react-autobind";
import { ContentEditingContainer } from "./index";
import { ScoreInput } from "../../../../../components";
import { meanBy, values } from "lodash";
import Formsy from "formsy-react";

const scorecardOrder = [
  "consumer_token_design",
  "project_governance_and_operation",
  "responsible_token_distribution",
  "use_of_token_distribution_proceeds",
  "token_inventory",
  "mitigation_of_conflicts_and_improper_trading",
  "token_safety_and_security",
  "marketing_practices",
  "protecting_and_empowering_consumers",
  "compliance_with_application_laws"
];

export default class VersionScorecard extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      scorecard: this.props.scorecard,
      editing: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.scorecard, prevProps.scorecard)) {
      this.setState({ scorecard: this.props.scorecard });
    }
  }

  handleEditOnClick() {
    this.setState({
      editing: true
    });
  }

  handleScorecardChange(currentValues, isChanged) {
    this.setState({
      scorecard: this.scorecard.getModel()
    });
  }

  handleSubmit() {
    this.props.editScorecard({
      scorecard: this.state.scorecard,
      versionId: this.props.versionMetadata.id
    });
    this.setState({
      editing: false
    });
  }

  handleCancel() {
    this.setState({
      editing: false,
      scorecard: this.props.scorecard
    });
  }

  render() {
    const {
      user,
      scorecard,
      parent,
      editScorecard,
      versionMetadata,
      documentMetadata
    } = this.props;
    const validations = "isWithin:[1, 10]";
    const validationError = "the score must be within 1 to 10";
    return (
      <Element
        name="qna-scorecard"
        ref={el => (parent["qna-scorecard"] = el)}
        key="qna-scorecard"
      >
        <div className="qna__container mb-4">
          <ContentEditingContainer
            otherClassNames="qna__answer-container"
            editing={this.state.editing}
            handleEditOnClick={this.handleEditOnClick}
            user={user}
            punditType="Disclosure"
            punditAction="Create"
            punditModel={{
              project: this.props.documentMetadata.project,
              disclosure: this.props.documentMetadata
            }}
          >
            <Formsy
              ref={f => (this.scorecard = f)}
              className=""
              onChange={this.handleScorecardChange}
              name="project-scorecard__form"
            >
              <div
                className="markdown-body qna__answer"
                style={{ width: "100%", margin: 0 }}
              >
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">principle</th>
                      <th className="text-left">score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecardOrder.map(principleKey => {
                      var principle = capitalize(
                        principleKey.replace(/_/g, " ")
                      );
                      return (
                        <tr>
                          <td className="text-left">{principle}</td>

                          {this.state.editing ? (
                            <td className="">
                              <ScoreInput
                                name={principleKey}
                                validations={validations}
                                validationError={validationError}
                                value={scorecard[principleKey]}
                                zeroMargin={true}
                                required
                              />
                            </td>
                          ) : (
                            <td className="text-left">
                              {scorecard[principleKey]}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="text-left"><b>OVERALL TRANSPARENCY SCORE</b></td>
                      <td className="text-left">
                        <b>
                          {meanBy(values(this.state.scorecard), s =>
                            Number(s)
                          ).toFixed(1)}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {this.state.editing ? (
                  <div className="d-flex justify-content-end my-3">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleSubmit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={this.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
              </div>
            </Formsy>
          </ContentEditingContainer>
        </div>
      </Element>
    );
  }
}
