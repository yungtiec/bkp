import React, { Component, Fragment } from "react";
import { ListItem } from "../../../components";
import { ScaleLoader } from "halogenium";
import moment from "moment";

const ListMyDocuments = ({ documents }) =>
  documents.length ? (
    <Fragment>
      {documents.map(doc => (
        <ListItem
          cardKey={doc.id}
          cardHref={`/s/${doc.slug}`}
          mainTitle={doc.title}
          subtitle={""}
          textUpperRight={moment(doc.createdAt).fromNow()}
          mainText={""}
        />
      ))}
    </Fragment>
  ) : null;

export default ({ documents, canLoadMore, fetchOwnDrafts }) => (
  <div class="dashboard__recent-my-documents">
    {!documents ? (
      <div className="component__loader-container d-flex">
        <ScaleLoader
          className="component__loader"
          color="#2d4dd1"
          size="16px"
          margin="4px"
        />
      </div>
    ) : documents && !documents.length ? (
      <div className="component__loader-container d-flex">
        currently has no myDocument available
      </div>
    ) : (
      <ListMyDocuments
        documents={documents}
      />
    )}
    {canLoadMore ? (
      <a className="dashboard__show-more" onClick={fetchOwnDrafts}>
        <p>show more</p>
      </a>
    ) : null}
  </div>
);
