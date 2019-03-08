import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchQuestionBySlug } from "../data/actions";
import { getQuestionsBySlug } from "../data/reducer";
import { Question } from "./index";

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
  var questionsBySlug = getQuestionsBySlug(state);
  return {
    ...ownProps,
    question:
      ownProps.match &&
      ownProps.match.params &&
      questionsBySlug &&
      questionsBySlug[ownProps.match.params.slug]
  };
};

const action = {
  fetchQuestionBySlug
};

export default withRouter(
  connect(
    mapState,
    action
  )(QueryQuestion)
);
