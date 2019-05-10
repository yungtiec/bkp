import { values, keyBy, uniq } from "lodash";
import * as types from "./actionTypes";
import { getFeatureDocuments, getFilteredDocumentsWithStats } from "./service";

export const fetchFeatureDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const featureDocuments = await getFeatureDocuments();
    const documentsById = keyBy(featureDocuments, "id");
    const featureDocumentIds = featureDocuments.map(fd => fd.id);

    dispatch({
      type: types.FEATURE_DOCUMENTS_FETCH_SUCESSS,
      documentsById,
      featureDocumentIds
    });
  } catch (err) {
    console.log(err);
  }
};

export function fetchFilteredDocumentsWithStats() {
  return async (dispatch, getState) => {
    try {
      dispatchFetchFilteredDocumentsWithStats({
        dispatch,
        getState,
        loadMore: true
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function updateFilter({ key, value }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_UPDATED,
        key,
        value
      });
      dispatchFetchFilteredDocumentsWithStats({ dispatch, getState });
    } catch (err) {
      console.log(err);
    }
  };
}

export function clearFilter(key) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_CLEAR,
        key
      });
      dispatchFetchFilteredDocumentsWithStats({ dispatch, getState });
    } catch (err) {
      console.log(err);
    }
  };
}

async function dispatchFetchFilteredDocumentsWithStats({
  dispatch,
  getState,
  loadMore
}) {
  const state = getState();
  var { offset, limit, filters } = state.scenes.feed.data;

  if (!loadMore) {
    offset = 0;
    dispatch({
      type: types.DOCUMENTS_REQUESTED
    });
  } else {
    dispatch({
      type: types.ADDITIONAL_DOCUMENTS_REQUESTED
    });
  }
  var documents = await getFilteredDocumentsWithStats({
    offset,
    limit,
    ...filters
  });
  const documentIds = uniq(documents.map(fd => fd.id));
  const documentsById = keyBy(documents, "id");
  dispatch({
    type: types.DOCUMENTS_FETCH_SUCESSS,
    documentsById,
    documentIds,
    offset: offset + limit,
    endOfResult: documentIds.length < limit || !documentIds.length,
    loadMore
  });
}
