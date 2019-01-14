import React, { Component } from "react";
import { Element } from "react-scroll";
import { Qna, Question, Answers, VersionScorecard } from "./index";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { updateContentHTMLBySlug } from "./../../../data/documentMetadata/actions.js";
import CkEditor from '../../../../../../client/components/CkEditor/CkEditor.js';
import ActiveToggle from './ActiveToggle';
import CategorySelect from './CategorySelect';

const VersionContent = ({
  updateContentHTMLBySlug,
  location,
  user,
  isLoggedIn,
  isClosedForComment,
  documentMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer
}) => (
  <div className="project-document" id="project-document">
    <CkEditor
      isLoggedIn={isLoggedIn}
      isClosedForComment={isClosedForComment}
      documentMetadata={documentMetadata}
      updateContentHTMLBySlug={updateContentHTMLBySlug}
      addNewCommentSentFromServer={addNewCommentSentFromServer}/>
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
