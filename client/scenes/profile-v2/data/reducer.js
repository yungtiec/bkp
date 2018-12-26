import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.USER_PROFILE_FETCH_SUCCESS:
      return {
        ...state,
        profile: action.profile
      };
    default:
      return state;
  }
}

export const getUserProfile = state => state.scenes.profileV2.data.profile;
