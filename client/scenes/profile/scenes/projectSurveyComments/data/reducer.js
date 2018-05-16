import { keyBy, keys, values, groupBy, orderBy, assignIn, forIn } from "lodash";
import * as types from "./actionTypes";
import moment from "moment";

const initialState = {
  projectSurveyCommentsById: {},
  projectSurveyCommentIds: [],
  pageCount: 0,
  pageLimit: 10,
  pageOffset: 0,
  pageProjectFilter: [],
  pageSurveyFilter: [],
  checked: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_PROJECT_SURVEY_COMMENTS_FETCH_SUCCESS:
      return {
        ...state,
        projectSurveyCommentsById: action.projectSurveyCommentsById,
        projectSurveyCommentIds: action.projectSurveyCommentIds,
        pageCount: Math.ceil(
          action.projectSurveyCommentsCount / state.pageLimit
        )
      };
    case types.PAGE_LIMIT_UPDATED:
      return { ...state, pageLimit: action.pageLimit };
    case types.PAGE_OFFSET_UPDATED:
      return { ...state, pageOffset: action.pageOffset };
    case types.PAGE_PROJECT_FILTER_UPDATED:
      return { ...state, pageProjectFilter: action.pageProjectFilter };
    case types.PAGE_SURVEY_FILTER_UPDATED:
      return { ...state, pageSurveyFilter: action.pageSurveyFilter };
    case types.SIDEBAR_FILTER_CHECKED:
      return { ...state, checked: action.checked };
    default:
      return state;
  }
}

export const getUserProjectSurveyComments = state => {
  const {
    projectSurveyCommentsById,
    projectSurveyCommentIds
  } = state.scenes.profile.scenes.projectSurveyComments.data;
  return {
    projectSurveyCommentsById,
    projectSurveyCommentIds
  };
};