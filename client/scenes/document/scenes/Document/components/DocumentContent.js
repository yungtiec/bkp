import React, { Component } from "react";
import { Element } from "react-scroll";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { updateContentHTMLBySlug } from "./../../../data/documentMetadata/actions.js";
import { updateSidebarCommentContext } from "../../../reducer";
import DocumentEditor from "../../../../../../client/components/DocumentEditor/DocumentEditor.js";
import { closeSidebar } from '../../../reducer';
import ActiveToggle from "./ActiveToggle";

const DocumentContent = ({
  updateSidebarCommentContext,
  updateContentHTMLBySlug,
  location,
  user,
  isLoggedIn,
  isAdmin,
  isClosedForComment,
  documentMetadata,
  commentOnClick,
  parent,
  tags,
  tagFilter,
  addNewCommentSentFromServer,
  displayEditor,
  hideEditor,
  closeSidebar
}) => (
  <div className={documentMetadata.has_annotator ? `project-document mt-3` : `project-document__no-annotator mt-3`} id="project-document">
    <DocumentEditor
      isAdmin={isAdmin}
      isLoggedIn={isLoggedIn}
      isClosedForComment={isClosedForComment}
      documentMetadata={documentMetadata}
      updateSidebarCommentContext={updateSidebarCommentContext}
      updateContentHTMLBySlug={updateContentHTMLBySlug}
      addNewCommentSentFromServer={addNewCommentSentFromServer}
      displayEditor={displayEditor}
      hideEditor={hideEditor}
      closeSidebar={closeSidebar}
      user={user}
    />
  </div>
);

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
});

const actions = {
  updateContentHTMLBySlug,
  updateSidebarCommentContext,
  closeSidebar
};

export default connect(
  mapState,
  actions
)(DocumentContent);
