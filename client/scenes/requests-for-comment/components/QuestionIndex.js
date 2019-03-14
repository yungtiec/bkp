import React, { Fragment } from "react";
import { QuestionFilter, QueryQuestionList } from "./index";
import { HeroHeader } from "../../../components";

export default () => (
  <Fragment>
    <div className="app-container">
      <HeroHeader
        title="Requests For Comment"
        subtitle="Join the collaboration on blockchain law, regulation, and policy."
      />
    </div>
    <QuestionFilter marginClass="mb-5 py-4" />
    <QueryQuestionList />
  </Fragment>
);
