import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getOwnDrafts } from "./service";

export const fetchOwnDrafts = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      draftOffset,
      draftLimit
    } = state.scenes.myDocuments.scenes.drafts.data;
    const { count, rows } = await getOwnDrafts({
      offset: draftOffset,
      limit: draftLimit
    });
    dispatch({
      type: types.DRAFTS_FETCHED_SUCESSS,
      draftOffset: draftOffset + draftLimit,
      draftDocuments: rows,
      count
    });
  } catch (err) {
    console.log(err);
  }
};
