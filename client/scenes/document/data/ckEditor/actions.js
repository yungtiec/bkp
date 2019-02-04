import * as types from "./actionTypes";

export const showEditor = (modalType, modalProps) => {
  return {
    type: types.SHOW_EDITOR
  };
};

export const hideEditor = () => {
  return {
    type: types.HIDE_EDITOR
  };
};

export const updateDocument = (document) => {
  return {
    type: types.UPDATE_DOCUMENT,
    document
  };
};
