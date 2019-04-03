import "./Feed.scss";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import {
  QueryDocumentList,
  QueryHeroHeadline,
  DocumentFilter
} from "./components";
import { HeroHeader } from "../../components";

export default () => (
  <Fragment>
    <Helmet>
      <title>The Brooklyn Project</title>
      <meta
        name="description"
        content="Join the collaboration on blockchain law, regulation, and policy."
      />
    </Helmet>
    <div className="app-container">
      <HeroHeader
        title="The Brooklyn Project"
        subtitle="Join the collaboration on blockchain law, regulation, and policy."
      />
      <QueryHeroHeadline />
    </div>
    <DocumentFilter marginClass="my-5" />
    <div className="app-container">
      <QueryDocumentList />
    </div>
  </Fragment>
);
