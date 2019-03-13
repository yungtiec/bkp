import * as types from "./actionTypes";
import { values, keyBy } from "lodash";
import {
  getQuestionBySlug,
  postDownvoteToQuestion,
  postUpvoteToQuestion,
  postComment,
  getCommentsByQuestionId
} from "./service";
import history from "../../../../../history";

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

export const addNewComment = ({ question, newComment, selectedTags }) => {
  return async (dispatch, getState) => {
    try {
      const postedComment = await postComment({
        questionId: question.id,
        newComment,
        selectedTags
      });
      dispatch({
        type: types.COMMENT_ADDED,
        comment: postedComment,
        slug: question.slug
      });
      history.push(
        `/requests-for-comment/${question.slug}/comment/${postedComment.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export function updateCommentFilter({ key, value }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_UPDATED,
        key,
        value
      });
      dispatchFetchFilteredComments({
        dispatch,
        getState
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function clearCommentFilter(key) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_CLEAR,
        key
      });
      dispatchFetchFilteredComments({
        dispatch,
        getState
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export const fetchCommentsById = questionSlug => {
  return async (dispatch, getState) => {
    try {
      dispatchFetchFilteredComments({
        dispatch,
        getState,
        questionSlug,
        loadMore: true
      });
    } catch (err) {
      next(err);
    }
  };
};

async function dispatchFetchFilteredComments({
  dispatch,
  getState,
  questionSlug,
  loadMore
}) {
  const state = getState();
  var {
    commentOffset,
    commentLimit,
    question,
    commentfilters
  } = state.scenes.requestsForComment.scenes.question.data;
  questionSlug = questionSlug || question.slug;
  if (!loadMore) {
    commentOffset = 0;
    dispatch({
      type: types.COMMENTS_REQUESTED
    });
  } else {
    dispatch({
      type: types.ADDITIONAL_COMMENTS_REQUESTED
    });
  }
  const comments = await getCommentsByQuestionId({
    questionSlug,
    offset: commentOffset,
    limit: commentLimit,
    ...commentfilters
  });
  const commentIds = comments.map(fd => fd.id);
  const commentsById = keyBy(comments, "id");
  dispatch({
    type: types.COMMENTS_FETCHED,
    commentsById,
    commentIds,
    commentOffset: commentOffset + commentLimit,
    commentEndOfResult: commentIds.length < commentLimit || !commentIds.length,
    loadMore
  });
}
