import { omit } from "lodash";
import { default as dataReducer } from "./data/reducer";

const initialState = {};


export default function reduce(state = initialState, action) {
  switch (action.type) {
    default:
      const rest = _.omit(state, Object.keys(initialState));
      return {
        ...state,
        data: dataReducer(rest.data, action)
      };
  }
}
