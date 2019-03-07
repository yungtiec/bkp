import * as types from "./actionTypes";

export function updateFilter({ key, value }) {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.FILTER_UPDATED,
        key,
        value
      });
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
    } catch (err) {
      console.log(err);
    }
  };
}
