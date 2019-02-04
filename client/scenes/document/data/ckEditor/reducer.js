import * as types from "./actionTypes";

const initialState = {
  displayEditor: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_EDITOR:
      return {
        displayEditor: true
      };
    case types.HIDE_EDITOR:
      return {
        displayEditor: false
      };
    default:
      return state;
  }
}
