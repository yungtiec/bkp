import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import getOwnFeaturedDocuments from "./service";

export const fetchOwnFeaturedDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      featuredDocumentLimit
    } = state.scenes.myDocuments.scenes.featuredDocuments.data;
    const { count, rows } = await getOwnFeaturedDocuments({
      limit: featuredDocumentLimit
    });
    dispatch({
      type: types.FEATURED_DOCUMENTS_FETCHED_SUCESSS,
      featuredDocuments: rows,
      count
    });
  } catch (err) {
    console.log(err);
  }
};
