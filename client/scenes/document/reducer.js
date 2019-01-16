import { omit } from "lodash";
import { reducer as dataReducer } from "./data/reducer";

export const SIDEBAR_OPEN_TOGGLE = "document.SIDEBAR_OPEN_TOGGLE";
export const ANNOTATION_HIGHLIGHT_TOGGLE =
  "document.ANNOTATION_HIGHLIGHT_TOGGLE";
export const VERIFICATION_STATUS_IN_VIEW =
  "document.VERIFICATION_STATUS_IN_VIEW";
export const COMMENT_SORT_BY = "document.COMMENT_SORT_BY";
export const SIDEBAR_COMMENT_CONTEXT_UPDATED =
  "document.SIDEBAR_COMMENT_CONTEXT_UPDATED";
export const SIDEBAR_CONTEXT_UPDATED = "document.SIDEBAR_CONTEXT_UPDATED";
export const ISSUE_FILTER_UPDATED = "document.ISSUE_FILTER_UPDATED";

export const toggleSidebar = () => ({
  type: SIDEBAR_OPEN_TOGGLE
});

export const toggleAnnotationHighlight = () => ({
  type: ANNOTATION_HIGHLIGHT_TOGGLE
});

export const updateVerificationStatusInView = verificationStatus => ({
  type: VERIFICATION_STATUS_IN_VIEW,
  verificationStatus
});

export const sortCommentBy = commentSortBy => ({
  type: COMMENT_SORT_BY,
  commentSortBy
});

export const updateSidebarCommentContext = sidebarCommentContext => ({
  type: SIDEBAR_COMMENT_CONTEXT_UPDATED,
  sidebarCommentContext
});

export const updateIssueFilter = issueFilter => ({
  type: ISSUE_FILTER_UPDATED,
  issueFilter
});

export const toggleSidebarContext = () => ({
  type: SIDEBAR_CONTEXT_UPDATED
});

const initialState = {
  sidebarOpen: true,
  annotationHighlight: true,
  verificationStatus: "all",
  commentSortBy: "position",
  commentIssueFilter: [],
  sidebarCommentContext: {
    selectedText: "",
    selectedCommentIds: null,
    focusOnce: false
  },
  sidebarContext: "comments" // options are comment and table of contents
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case "environment.CHANGE_WIDTH_AND_HEIGHT":
      if (action.width < 600) return { ...state, sidebarOpen: false };
      else return { ...state, sidebarOpen: true };
    case VERIFICATION_STATUS_IN_VIEW:
      return { ...state, verificationStatus: action.verificationStatus };
    case SIDEBAR_OPEN_TOGGLE:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ANNOTATION_HIGHLIGHT_TOGGLE:
      return { ...state, annotationHighlight: !state.annotationHighlight };
    case SIDEBAR_CONTEXT_UPDATED:
      return {
        ...state,
        sidebarContext:
          state.sidebarContext === "comments" ? "tableOfContents" : "comments"
      };
    case COMMENT_SORT_BY:
      return { ...state, commentSortBy: action.commentSortBy };
    case SIDEBAR_COMMENT_CONTEXT_UPDATED:
      return {
        ...state,
        sidebarCommentContext: {
          ...state.sidebarCommentContext,
          ...action.sidebarCommentContext
        }
      };
    case ISSUE_FILTER_UPDATED:
      return {
        ...state,
        commentIssueFilter: action.issueFilter
      };
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}

export const getSidebarCommentContext = state =>
  state.scenes.document.sidebarCommentContext;
