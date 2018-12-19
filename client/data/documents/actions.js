import * as types from "./actionTypes.js";
import { getLastestDocumentsWithStats } from "./service";
import { keyBy } from "lodash";

export function fetchLastestDocumentsWithStats(hasLimit) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { offset, limit } = state.data.documents;
      const { count, documents } = await getLastestDocumentsWithStats({
        offset,
        limit,
        hasLimit: hasLimit || false
      });
      const documentIds = documents.map(s => s.id);
      const documentsById = keyBy(documents, "id");
      dispatch({
        type: types.DOCUMENT_LISTING_FETCH_SUCCESS,
        documentsById,
        documentIds,
        count,
        offset: offset + limit
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.DOCUMENT_LISTING__FETCH_ERROR
      });
    }
  };
}
