import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, VersionScorecard } from "./index";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { updateContentHTMLBySlug } from "./../../../data/documentMetadata/actions.js";
import CkEditor from '/Users/johnquiwa/consensys/bkp/client/components/CkEditor/CkEditor.js';

const VersionContent = ({
  updateContentHTMLBySlug,
  location,
  user,
  isLoggedIn,
  isClosedForComment,
  documentMetadata,
  versionQnasById,
  versionQnaIds,
  editScorecard,
  editQuestion,
  editAnswer,
  revertToPrevQuestion,
  revertToPrevAnswer,
  versionMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => (
  <div className="project-document" id="project-document">
    <CkEditor documentMetadata={documentMetadata} updateContentHTMLBySlug={updateContentHTMLBySlug}/>
  </div>
);

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user
});

const actions = {
  updateContentHTMLBySlug
};

export default connect(mapState, actions)(VersionContent);
