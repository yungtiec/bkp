import * as types from "./actionTypes";

const defaultUser = {};

export default function(state = defaultUser, action) {
  switch (action.type) {
    case types.GET_USER:
      return {
        ...state,
        ...action.user,
      };
    case types.REMOVE_USER:
      return defaultUser;
    case types.PROFILE_UPDATED:
      return {
        ...state,
        first_name: action.profile.firstName,
        last_name: action.profile.lastName,
        name: action.profile.name,
        displayName: action.profile.displayName,
        organization: action.profile.organization,
        user_handle: action.profile.user_handle
      };
    case types.ONBOARD_STATUS_UPDATED:
      return {
        ...state,
        onboard: true
      };
    case types.MANAGED_PROJECTS_FETCH_SUCCESS:
      return {
        ...state,
        projectSymbolArr: action.projectSymbolArr,
        projectsBySymbol: action.projectsBySymbol
      };
    case types.OWN_SURVEYS_FETCH_SUCCESS:
      return {
        ...state,
        documentsById: action.documentsById,
        documentIds: action.documentIds
      };
    default:
      return state;
  }
}

export const currentUserIsAdmin = state => {
  return (
    state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length
  );
};

export function getManagedProjects(state) {
  const { projectSymbolArr, projectsBySymbol } = state.data.user;
  return {
    projectSymbolArr,
    projectsBySymbol
  };
}

export function getOwnDocuments(state) {
  const { documentsById, documentIds } = state.data.user;
  return {
    documentsById,
    documentIds
  };
}
