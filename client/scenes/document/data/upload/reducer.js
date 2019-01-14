import * as types from "./actionTypes";
import { DOCUMENT_METADATA_FETCH_SUCCESS } from "../documentMetadata/actionTypes";
//import { PROJECT_SURVEY_METADATA_FETCH_SUCCESS } from "../versionMetadata/actionTypes";
import { uniq, isEmpty, values } from "lodash";

const PROJECT_SURVEY_METADATA_FETCH_SUCCESS = 'PROJECT_SURVEY_METADATA_FETCH_SUCCESS';
const initialState = {
  markdown: null,
  versionNumber: "",
  resolvedIssueIds: [],
  collaboratorEmails: [],
  collaboratorOptions: [],
  newResolvedIssues: [],
  commentPeriodValue: 3,
  commentPeriodUnit: "days",
  scorecard: {}
};

function updateResolvedIssues(state, action) {
  var resolvedIssueIds;
  if (state.resolvedIssueIds.indexOf(action.issueId) !== -1) {
    resolvedIssueIds = state.resolvedIssueIds.filter(
      id => id !== action.issueId
    );
  } else {
    resolvedIssueIds = state.resolvedIssueIds.concat([action.issueId]);
  }
  return {
    ...state,
    resolvedIssueIds
  };
}

function updateNewIssues(state, action) {
  var newResolvedIssues;
  switch (action.type) {
    case types.ISSUE_ADDED:
      newResolvedIssues = [action.issue].concat(state.newResolvedIssues);
      break;
    case types.ISSUE_DELETED:
      newResolvedIssues = state.newResolvedIssues.filter(issue => issue !== action.issue);
      break;
    default:
      newResolvedIssues = state.newResolvedIssues;
      break;
  }
  return {
    ...state,
    newResolvedIssues: uniq(newResolvedIssues)
  };
}

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.COLLABORATOR_OPTIONS_FETCHED_SUCCESS:
      return {
        ...state,
        collaboratorOptions: action.collaboratorOptions
      };
    case DOCUMENT_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        collaboratorEmails: action.documentMetadata.collaborators.map(c => ({
          label: c.email,
          value: c.email
        }))
      };
    case PROJECT_SURVEY_METADATA_FETCH_SUCCESS:
      return {
        ...state,
        scorecard: action.versionMetadata.scorecard
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
        resolvedIssueIds: [],
        newResolvedIssues: [],
        commentPeriodValue: 3,
        commentPeriodUnit: "days"
      };
    case types.ISSUE_SELECTED:
      return updateResolvedIssues(state, action);
    case types.COLLABORATOR_UPDATED:
      return {
        ...state,
        collaboratorEmails: action.collaboratorEmails
      };
    case types.ISSUE_ADDED:
    case types.ISSUE_DELETED:
      return updateNewIssues(state, action);
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
    default:
      return state;
  }
}

export function getVersionUploadMetadata(state) {
  var {
    markdown: importedMarkdown,
    resolvedIssueIds,
    collaboratorEmails,
    collaboratorOptions,
    newResolvedIssues,
    versionNumber,
    commentPeriodUnit,
    commentPeriodValue,
    scorecard
  } = state.scenes.document.data.upload;
  return {
    importedMarkdown,
    resolvedIssueIds,
    collaboratorEmails,
    collaboratorOptions,
    newResolvedIssues,
    versionNumber,
    commentPeriodUnit,
    commentPeriodValue,
    scorecard,
    scorecardCompleted:
      !isEmpty(scorecard) &&
      values(scorecard).reduce((bool, score) => !!score && bool, true)
  };
}
