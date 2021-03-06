import * as types from "./actionTypes";
import { uniq, isEmpty, values } from "lodash";

const initialState = {
  markdown: null,
  versionNumber: "",
  collaboratorEmails: [],
  commentPeriodValue: 3,
  commentPeriodUnit: "days",
  selectedProject: "",
  projectSymbolArr: [],
  projectsBySymbol: {},
  collaboratorOptions: [],
  scorecard: {},
  title: "",
  headerImageUrl: "",
  category: null,
  tags: [],
  summary: "",
  indexDescription: "",
  hasAnnotator : false
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.RESET_SUBMIT_FORM:
      return {
        ...initialState
      };
    case types.MARKDOWN_IMPORTED:
      return {
        ...state,
        markdown: action.markdown
      };
    case types.MARKDOWN_UPLOADED:
      return {
        ...state,
        markdown: null,
        collaboratorEmails: [],
        commentPeriodValue: 3,
        commentPeriodUnit: "days",
        selectedProject: ""
      };
    case types.COLLABORATOR_UPDATED:
      return {
        ...state,
        collaboratorEmails: action.collaboratorEmails
      };
    case types.COMMENT_PERIOD_UNIT_UPDATED:
      return {
        ...state,
        commentPeriodUnit: action.commentPeriodUnit
      };
    case types.COMMENT_PERIOD_VALUE_UPDATED:
      return {
        ...state,
        commentPeriodValue: action.commentPeriodValue
      };
    case types.SELECTED_PROJECT_UPDATED:
      return {
        ...state,
        selectedProject: action.selectedProject,
        collaboratorOptions: action.selectedProject.collaboratorOptions
      };
    case types.VERSION_NUMBER_UPDATED:
      return {
        ...state,
        versionNumber: action.versionNumber
      };
    case types.PROJECT_SCORECARD_UPDATED:
      return {
        ...state,
        scorecard: action.projectScorecard
      };
    case types.TITLE_UPDATED:
      return {
        ...state,
        title: action.title
      };
    case types.CATAGORY_UPDATED:
      return {
        ...state,
        category: action.category
      };
    case types.TAGS_UPDATED:
      return {
        ...state,
        tags: action.tags
      };
    case types.HEADER_IMAGE_URL_UPDATED:
      return {
        ...state,
        headerImageUrl: action.headerImageUrl
      };
    case types.CONTENT_HTML_UPDATED:
      return {
        ...state,
        contentHtml: action.contentHtml
      };
    case types.INDEX_DESCRIPTION_UPDATED:
      return {
        ...state,
        indexDescription: action.indexDescription
      };
    case types.SUMMARY_UPDATED:
      return {
        ...state,
        summary: action.summary
      };
    case types.HAS_ANNOTATOR_UPDATED:
      return {
        ...state,
        hasAnnotator: action.hasAnnotator
      };
    default:
      return state;
  }
}

export function getUploadMetadata(state) {
  var {
    contentHtml,
    selectedProject,
    collaboratorEmails,
    collaboratorOptions,
    commentPeriodUnit,
    commentPeriodValue,
    title,
    category,
    tags,
    headerImageUrl,
    scorecard,
    summary,
    indexDescription,
  } = state.scenes.upload.data.upload;
  return {
    contentHtml,
    selectedProject,
    collaboratorEmails,
    collaboratorOptions,
    commentPeriodUnit,
    commentPeriodValue,
    title,
    category,
    tags,
    headerImageUrl,
    scorecard,
    summary,
    indexDescription,
    scorecardCompleted:
      !isEmpty(scorecard) &&
      values(scorecard).reduce((bool, score) => !!score && bool, true)
  };
}
