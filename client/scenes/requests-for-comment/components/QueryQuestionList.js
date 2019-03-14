import React from "react";
import { range } from "lodash";
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
import { ArticleStyleLoader } from "../../../components";

class QueryQuestionList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchQuestions();
  }

  render() {
    if (this.props.questionsLoading)
      return (
        <div className="app-container">
          {range(5).map(rand => (
            <ArticleStyleLoader
              mobile={this.props.screenWidth < 768}
              hideImg={true}
            />
          ))}
        </div>
      );
    else return <QuestionList {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { offset, limit, endOfResult } = getFilteredQuestionsOffsetAndLimit(
    state
  );

  const {
    additionalQuestionsLoading,
    questionsLoading
  } = getFilteredQuestionsLoadingStatus(state);
  return {
    ...ownProps,
    questionsBySlug: getQuestionsBySlug(state),
    questionSlugs: getQuestionSlugs(state),
    offset,
    limit,
    endOfResult,
    questionsLoading,
    additionalQuestionsLoading,
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
