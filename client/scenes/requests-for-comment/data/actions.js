import * as types from "./actionTypes";
import { values, keyBy } from "lodash";
import {
  postQuestion,
  getQuestionBySlug,
  getFilteredQuestions,
  postDownvoteToQuestion,
  postUpvoteToQuestion
} from "./service";
import history from "../../../history";

export function updateFilter({ key, value }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_UPDATED,
        key,
        value
      });
      dispatchFetchFilteredQuestions({
        dispatch,
        getState
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function clearFilter(key) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_CLEAR,
        key
      });
      dispatchFetchFilteredQuestions({
        dispatch,
        getState
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createQuestion(q) {
  return async (dispatch, getState) => {
    try {
      const question = await postQuestion(q);
      dispatch({
        type: types.QUESTION_POSTED,
        question
      });
      history.push(`/requests-for-comment/${question.slug}`);
    } catch (err) {
      console.log(err);
    }
  };
}

export function fetchQuestionBySlug(slug) {
  return async (dispatch, getState) => {
    try {
      const question = await getQuestionBySlug(slug);
      dispatch({
        type: types.QUESTION_FETCHED,
        question
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function fetchQuestions() {
  return async (dispatch, getState) => {
    try {
      dispatchFetchFilteredQuestions({
        dispatch,
        getState,
        loadMore: true
      });
    } catch (err) {
      console.log(err);
    }
  };
}

async function dispatchFetchFilteredQuestions({
  dispatch,
  getState,
  loadMore
}) {
  const state = getState();
  var { offset, limit, filters } = state.scenes.requestsForComment.data;
  if (!loadMore) {
    offset = 0;
    dispatch({
      type: types.QUESTIONS_REQUESTED
    });
  } else {
    dispatch({
      type: types.ADDITIONAL_QUESTIONS_REQUESTED
    });
  }
  var questions = await getFilteredQuestions({
    offset,
    limit,
    ...filters
  });
  const questionSlugs = questions.map(fd => fd.slug);
  const questionsBySlug = keyBy(questions, "slug");
  dispatch({
    type: types.QUESTIONS_FETCH_SUCCESS,
    questionsBySlug,
    questionSlugs,
    offset: offset + limit,
    endOfResult: questionSlugs.length < limit || !questionSlugs.length,
    loadMore
  });
}

export function downvoteQuestion({ question, hasUpvoted, hasDownvoted }) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postDownvoteToQuestion({
        questionId: question.id,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.QUESTION_VOTED,
        upvotesFrom,
        downvotesFrom,
        slug: question.slug
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function upvoteQuestion({ question, hasUpvoted, hasDownvoted }) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postUpvoteToQuestion({
        questionId: question.id,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.QUESTION_VOTED,
        upvotesFrom,
        downvotesFrom,
        slug: question.slug
      });
    } catch (err) {
      console.log(err);
    }
  };
}
