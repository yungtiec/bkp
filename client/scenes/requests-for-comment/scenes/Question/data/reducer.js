import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep, keys, find } from "lodash";

const initialState = {
  question: null,
  questionLoading: false,
  commentsById: null,
  commentIds: null,
  commentOffset: 0,
  commentLimit: 10,
  commentEndOfResult: false,
  commentsLoading: true,
  additionalCommentsLoading: false,
  commentFilters: {
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
    case types.COMMENT_ADDED:
      return addNewCommentSentFromServer({
        state: cloneDeep(state),
        comment: action.comment,
        isReply: false
      });
    case types.COMMENT_UPDATED:
      return addNewCommentSentFromServer({
        state: cloneDeep(state),
        comment: action.rootComment,
        isReply: true
      });
    case types.COMMENT_UPVOTED:
      return updateUpvotesForComment({
        state: cloneDeep(state),
        rootId: action.rootId,
        commentId: action.commentId,
        upvotesFrom: action.upvotesFrom
      });
    case types.CLEAR_COMMENTS:
      return {
        ...state,
        commentIds: null,
        commentOffset: 0,
        commentEndOfResult: false,
        commentFilters: initialState.commentFilters
      };
    default:
      return state;
  }
}

const addNewCommentSentFromServer = ({ state, comment, isReply }) => {
  state.commentsById[comment.id] = comment;
  if (!isReply) state.commentIds = [comment.id].concat(state.commentIds || []);
  return state;
};

const addVotesToQuestion = (action, state) => {
  var newState = cloneDeep(state);
  newState.question.downvotesFrom = action.downvotesFrom;
  newState.question.upvotesFrom = action.upvotesFrom;
  return { ...newState };
};

const updateUpvotesForComment = ({ state, commentId, rootId, upvotesFrom }) => {
  var target;
  if (state.commentsById[commentId]) {
    // itself is root
    state.commentsById[commentId].upvotesFrom = upvotesFrom;
  } else {
    // its descendant(reply) to another comment
    target = find(
      state.commentsById[rootId].descendents,
      a => a.id === commentId
    );
    target.upvotesFrom = upvotesFrom;
  }
  return state;
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
  return state.scenes.requestsForComment.scenes.question.data
    .commentOptionMenus;
}

export function getFilters(state) {
  return state.scenes.requestsForComment.scenes.question.data.commentFilters;
}
