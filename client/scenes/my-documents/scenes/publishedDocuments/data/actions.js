import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getOwnPublishedDocuments } from "./service";

export const fetchOwnPublishedDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      publishedDocumentLimit
    } = state.scenes.myDocuments.scenes.publishedDocuments.data;
    const { count, rows } = await getOwnPublishedDocuments({
      limit: publishedDocumentLimit
    });
    dispatch({
      type: types.PUBLISHED_DOCUMENTS_FETCHED_SUCESSS,
      publishedDocuments: rows,
      count
    });
  } catch (err) {
    console.log(err);
  }
};
