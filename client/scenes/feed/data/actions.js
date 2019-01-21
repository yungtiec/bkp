import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getFeatureDocuments } from "./service";

export const fetchFeatureDocuments = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const featureDocuments = await getFeatureDocuments();
    dispatch({
      type: types.FEATURE_DOCUMENTS_FETCHED_SUCESSS,
      featureDocuments
    });
  } catch (err) {
    console.log(err);
  }
};
