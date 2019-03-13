import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep } from "lodash";

const initialState = {
  question: null,
  questionLoading: false,
  commentsById: null,
  commentIds: null,
  commentOffset: 0,
  commentLimit: 10,
  commentEndOfResult: false,
  commentsLoading: false,
  additionalCommentsLoading: false,
  commentfilters: {
    tags: null,
    order: { value: "date", label: "most recent" },
    search: ""
  },
  commentOptionMenus: {
    order: [
      { value: "most-discussed", label: "most discussed" },
      { value: "most-upvoted", label: "most upvoted" },
      { value: "date", label: "most recent" }
    ]
  }
};

export default function(state = initialState, action) {
  var filters;
  switch (action.type) {
    case types.QUESTION_REQUESTED:
      return {
        ...state,
        questionLoading: true
      };
    case types.QUESTION_POSTED:
    case types.QUESTION_FETCHED:
      return {
        ...state,
        question: action.question
      };
    case types.QUESTION_VOTED:
      return addVotesToQuestion(action, state);
    case types.COMMENTS_REQUESTED:
      return {
        ...state,
        commentsLoading: true
      };
    case types.ADDITIONAL_COMMENTS_REQUESTED:
      return {
        ...state,
        additionalCommentsLoading: true
      };
    case types.COMMENTS_FETCHED:
      return {
        ...state,
        commentIds: action.loadMore
          ? (state.commentIds || []).concat(action.commentIds || [])
          : action.commentIds,
        commentsById: assignIn(state.commentsById, action.commentsById),
        commentOffset: action.commentOffset,
        commentEndOfResult: action.commentEndOfResult,
        commentsLoading: false,
        additionalCommentsLoading: false
      };
    default:
      return state;
  }
}

const addVotesToQuestion = (action, state) => {
  var newState = cloneDeep(state);
  newState.question.downvotesFrom = action.downvotesFrom;
  newState.question.upvotesFrom = action.upvotesFrom;
  return { ...newState };
};

export function getQuestion(state) {
  return state.scenes.requestsForComment.scenes.question.data.question;
}

export function getCommentsById(state) {
  return state.scenes.requestsForComment.scenes.question.data.commentsById;
}

export function getCommentIds(state) {
  return state.scenes.requestsForComment.scenes.question.data.commentIds;
}

export function getCommentsOffsetAndLimit(state) {
  return pick(state.scenes.requestsForComment.data, [
    "commentOffset",
    "commentLimit",
    "commentEndOfResult"
  ]);
}

export function getCommentsLoadingStatus(state) {
  return pick(state.scenes.requestsForComment.data, [
    "commentsLoading",
    "additionalCommentsLoading"
  ]);
}

export function getFilterOptionMenus(state) {
  return state.scenes.requestsForComment.data.optionMenus;
}

export function getFilters(state) {
  return state.scenes.requestsForComment.data.filters;
}
