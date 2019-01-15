import * as types from "./actionTypes";
import { cloneDeep } from "lodash";

const initialState = {};

export default function reduce(state = initialState, action = {}) {
  var newState;
  switch (action.type) {
    case types.BASIC_INFO_FETCH_SUCCESS:
      return {
        ...state,
        ...action.profile
      };
    case types.BASIC_INFO_RESET:
      return {};
    case types.ACCESS_STATUS_UPDATED:
      newState = cloneDeep(state);
      newState.restricted_access = action.accessStatus === "restricted";
      return newState;
    case types.ANONYMITY_UPDATED:
      newState = cloneDeep(state);
      newState.anonymity = !state.anonymity;
      return newState;
    case "user.PROFILE_UPDATED":
      return {
        ...state,
        first_name: action.profile.firstName,
        last_name: action.profile.lastName,
        name: action.profile.name,
        organization: action.profile.organization
      };
    default:
      return state;
  }
}

export const getUserBasicInfo = state => state.scenes.profile.scenes.about.data;
