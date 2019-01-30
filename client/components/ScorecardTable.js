import React, { Component } from "react";
import { keys, capitalize, isEqual } from "lodash";
import { meanBy, values } from "lodash";

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
  "compliance_with_applicable_laws"
];

export default ({ scorecard }) => (
  <table>
    <thead>
      <tr>
        <th className="text-left">principle</th>
        <th className="text-left">score</th>
      </tr>
    </thead>
    <tbody>
      {scorecardOrder.map(principleKey => {
        var principle = capitalize(principleKey.replace(/_/g, " "));
        return (
          <tr>
            <td className="text-left">{principle}</td>
            <td className="text-left">{scorecard[principleKey]}</td>
          </tr>
        );
      })}
      <tr>
        <td className="text-left">
          <b>OVERALL TRANSPARENCY SCORE</b>
        </td>
        <td className="text-left">
          <b>{meanBy(values(scorecard), s => Number(s)).toFixed(1)}</b>
        </td>
      </tr>
    </tbody>
  </table>
);
