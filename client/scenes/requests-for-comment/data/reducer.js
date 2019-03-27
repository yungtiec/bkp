import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep } from "lodash";

const initialState = {
  questionSlugs: null,
  featureQuestionIds: null,
  questionsBySlug: null,
  offset: 0,
  limit: 10,
  endOfResult: false,
  additionalQuestionsLoading: false,
  questionsLoading: true,
  filters: {
    tags: null,
    order: { value: "date", label: "most recent" },
    search: ""
  },
  optionMenus: {
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
    case types.FILTER_UPDATED:
      filters = cloneDeep(state.filters);
      filters[action.key] = action.value;
      return {
        ...state,
        filters
      };
    case types.FILTER_CLEAR:
      if (!action.key)
        return {
          ...state,
          filters: initialState.filters
        };
      else {
        state = cloneDeep(state);
        state.filters[action.key] = null;
        return {
          ...state
        };
      }
    case types.QUESTIONS_REQUESTED:
      return {
        ...state,
        questionsLoading: true
      };
    case types.ADDITIONAL_QUESTIONS_REQUESTED:
      return {
        ...state,
        additionalQuestionsLoading: true
      };
    case types.QUESTIONS_FETCH_SUCCESS:
      return {
        ...state,
        questionSlugs: action.loadMore
          ? (state.questionSlugs || []).concat(action.questionSlugs || [])
          : action.questionSlugs,
        questionsBySlug: assignIn(
          state.questionsBySlug,
          action.questionsBySlug
        ),
        offset: action.offset,
        endOfResult: action.endOfResult,
        questionsLoading: false,
        additionalQuestionsLoading: false
      };
    case types.QUESTION_POSTED:
      return {
        ...state,
        questionsBySlug: assignIn(
          { [action.question.slug]: action.question },
          state.questionsBySlug
        ),
        questionSlugs: [action.question.slug].concat(state.questionSlugs || [])
      };
    default:
      return state;
  }
}

const addVotesToQuestion = (action, state) => {
  var newState = cloneDeep(state);
  newState.questionsBySlug[action.slug].downvotesFrom = action.downvotesFrom;
  newState.questionsBySlug[action.slug].upvotesFrom = action.upvotesFrom;
  return { ...newState };
};

export function getFilterOptionMenus(state) {
  return state.scenes.requestsForComment.data.optionMenus;
}

export function getFilters(state) {
  return state.scenes.requestsForComment.data.filters;
}

export function getQuestionsBySlug(state) {
  return state.scenes.requestsForComment.data.questionsBySlug;
}

export function getQuestionSlugs(state) {
  return state.scenes.requestsForComment.data.questionSlugs;
}

export function getFilteredQuestionsOffsetAndLimit(state) {
  return pick(state.scenes.requestsForComment.data, [
    "offset",
    "limit",
    "endOfResult"
  ]);
}

export function getFilteredQuestionsLoadingStatus(state) {
  return pick(state.scenes.requestsForComment.data, [
    "additionalQuestionsLoading",
    "questionsLoading"
  ]);
}
