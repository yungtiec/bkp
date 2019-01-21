import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getFeatureDocuments, getFilteredDocumentsWithStats } from "./service";

export const fetchFeatureDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const featureDocuments = await getFeatureDocuments();
    const documentsById = keyBy(featureDocuments, "id");
    const featureDocumentIds = featureDocuments.map(fd => fd.id);

    dispatch({
      type: types.FEATURE_DOCUMENTS_FETCHED_SUCESSS,
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
      const state = getState();
      var limit = state.scenes.feed.data.limit;
      var offset = state.scenes.feed.data.offset;
      var { count, documents } = await getFilteredDocumentsWithStats({
        offset,
        limit
      });
      const documentsById = keyBy(documents.rows, "id");
      const documentIds = documents.rows.map(fd => fd.id);
      dispatch({
        type: types.DOCUMENTS_FETCHED_SUCESSS,
        documentsById,
        documentIds,
        offset: offset + limit,
        endOfResult: documentIds.length < limit || !documentIds.length
      });
    } catch (error) {
      console.log(error);
    }
  };
}
