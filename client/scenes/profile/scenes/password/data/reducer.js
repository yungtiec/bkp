import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.PASSWORD_UPDATE_SUCCESS:
      return {
        ...state,
        ...action.profile
      };

    default:
      return state;
  }
}

export const getUserBasicInfo = state => state.scenes.profile.scenes.about.data;
