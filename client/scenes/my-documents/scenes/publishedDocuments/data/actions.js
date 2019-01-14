import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getOwnPublishedDocuments } from "./service";

export const fetchOwnPublishedDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      publishedDocumentOffset,
      publishedDocumentLimit
    } = state.scenes.myDocuments.scenes.publishedDocuments.data;
    const { count, rows } = await getOwnPublishedDocuments({
      offset: publishedDocumentOffset,
      limit: publishedDocumentLimit
    });
    dispatch({
      type: types.PUBLISHED_DOCUMENTS_FETCHED_SUCESSS,
      publishedDocumentOffset: publishedDocumentOffset + publishedDocumentLimit,
      publishedDocuments: rows,
      count
    });
  } catch (err) {
    console.log(err);
  }
};
