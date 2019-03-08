import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchQuestions } from "../data/actions";
import {
  getFilterOptionMenus,
  getFilters,
  getQuestionsBySlug,
  getQuestionSlugs,
  getFilteredQuestionsOffsetAndLimit,
  getFilteredQuestionsLoadingStatus
} from "../data/reducer";
import { QuestionList } from "./index";

class QueryQuestionList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchQuestions();
  }

  render() {
    if (this.props.questionsLoading) return "loading";
    else return <QuestionList {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { offset, limit, endOfResult } = getFilteredQuestionsOffsetAndLimit(
    state
  );
  return {
    ...ownProps,
    questionsBySlug: getQuestionsBySlug(state),
    questionSlugs: getQuestionSlugs(state),
    offset,
    limit,
    endOfResult,
    questionsLoading: getFilteredQuestionsLoadingStatus(state),
    filters: getFilters(state),
    optionMenus: getFilterOptionMenus(state)
  };
};

const action = {
  fetchQuestions
};

export default withRouter(
  connect(
    mapState,
    action
  )(QueryQuestionList)
);
