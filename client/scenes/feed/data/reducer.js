import * as types from "./actionTypes";
import { assignIn, pick, cloneDeep } from "lodash";

const initialState = {
  documentIds: null,
  featureDocumentIds: null,
  documentsById: null,
  offset: 0,
  limit: 10,
  endOfResult: false,
  additionalDocumentsLoading: false,
  documentsLoading: true,
  filters: {
    category: null,
    tags: null,
    order: { value: "date", label: "most recent" },
    search: ""
  },
  optionMenus: {
    order: [
      { value: "most-discussed", label: "most discussed" },
      { value: "most-upvoted", label: "most upvoted" },
      { value: "date", label: "most recent" }
    ],
    category: [
      {
        value: "thought-leadership",
        label: "thought leadership"
      },
      {
        value: "transparency-scorecard",
        label: "transparency scorecard"
      },
      {
        value: "regulatory-notices",
        label: "regulatory notices"
      },
      {
        value: "regulatory-requests-for-comment",
        label: "regulatory requests for comment"
      },
      {
        value: "proposed-laws-and-regulations",
        label: "proposed laws and regulations"
      }
    ]
  }
};

export default function(state = initialState, action) {
  var filters;
  switch (action.type) {
    case types.FEATURE_DOCUMENTS_FETCH_SUCESSS:
      return {
        ...state,
        featureDocumentIds: action.featureDocumentIds,
        documentsById: assignIn(action.documentsById, state.documentsById)
      };
    case types.ADDITIONAL_DOCUMENTS_REQUESTED:
      return {
        ...state,
        additionalDocumentsLoading: true
      };
    case types.DOCUMENTS_REQUESTED:
      return {
        ...state,
        documentsLoading: true
      };
    case types.DOCUMENTS_FETCH_SUCESSS:
      return {
        ...state,
        documentIds: action.loadMore
          ? (state.documentIds || []).concat(action.documentIds || [])
          : action.documentIds,
        documentsById: assignIn(state.documentsById, action.documentsById),
        offset: action.offset,
        endOfResult: action.endOfResult,
        additionalDocumentsLoading: false,
        documentsLoading: false
      };
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

export function getFeatureDocuments(state) {
  return pick(state.scenes.feed.data, ["documentsById", "featureDocumentIds"]);
}

export function getFilteredDocuments(state) {
  return pick(state.scenes.feed.data, ["documentIds", "documentsById"]);
}

export function getFilteredDocumentsOffsetAndLimit(state) {
  return pick(state.scenes.feed.data, ["offset", "limit", "endOfResult"]);
}

export function getFilteredDocumentsLoadingStatus(state) {
  return pick(state.scenes.feed.data, [
    "additionalDocumentsLoading",
    "documentsLoading"
  ]);
}

export function getFilterOptionMenus(state) {
  return state.scenes.feed.data.optionMenus;
}

export function getFilters(state) {
  return state.scenes.feed.data.filters;
}
