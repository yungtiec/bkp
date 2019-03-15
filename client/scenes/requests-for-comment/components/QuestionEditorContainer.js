import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import QuestionEditor from "./QuestionEditor";
import { createQuestion } from "../data/actions";

const QuestionEditorContainer = props => <QuestionEditor {...props} />;

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    me: state.data.user
  };
};

const actions = {
  createQuestion
};

export default connect(
  mapState,
  actions
)(QuestionEditor);
