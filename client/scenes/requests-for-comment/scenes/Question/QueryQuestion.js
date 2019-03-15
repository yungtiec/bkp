import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchQuestionBySlug,
  downvoteQuestion,
  upvoteQuestion,
  addNewComment,
  editQuestion
} from "./data/actions";
import { getQuestion } from "./data/reducer";
import Question from "./Question";

class QueryQuestion extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchQuestionBySlug(this.props.match.params.slug);
  }

  render() {
    if (!this.props.question) return "loading";
    else return <Question {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  return {
    ...ownProps,
    question: getQuestion(state),
    me: state.data.user
  };
};

const action = {
  fetchQuestionBySlug,
  downvoteQuestion,
  upvoteQuestion,
  addNewComment,
  editQuestion
};

export default withRouter(
  connect(
    mapState,
    action
  )(QueryQuestion)
);
