import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep } from "lodash";

const initialState = {
  questionIds: null,
  featureQuestionIds: null,
  questionsById: null,
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
    default:
      return state;
  }
}

export function getFilterOptionMenus(state) {
  return state.scenes.requestsForComment.data.optionMenus;
}

export function getFilters(state) {
  return state.scenes.requestsForComment.data.filters;
}
