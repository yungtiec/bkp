import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserDocuments } from "./service";
import { getUserDocumentsOffsetAndLimit } from "./reducer";
import { notify } from "reapop";

export function fetchUserDocuments(userHandle, direction) {
  return async (dispatch, getState) => {
    try {
      var { offset, limit } = getUserDocumentsOffsetAndLimit(getState());
      if (direction) {
        offset = direction > 0 ? offset + limit : offset - limit;
      } else {
        offset = 0;
      }
      const results = await getUserDocuments({ userHandle, offset, limit });
      const documents = results[0];
      const documentsById = keyBy(documents, "document_id");
      const documentIds = documents.map(i => i.document_id);
      if (documentIds.length)
        dispatch({
          type: types.USER_DOCUMENTS_FETCH_SUCCESS,
          documentsById,
          documentIds,
          offset,
          endOfResult: documentIds.length < limit
        });
      else if (!documentIds.length && !direction) {
        // empty profile page where user has no document
        dispatch({
          type: types.USER_DOCUMENTS_FETCH_SUCCESS,
          documentsById: null,
          documentIds: null,
          endOfResult: true
        });
      } else {
        dispatch({
          type: types.USER_DOCUMENTS_FETCH_SUCCESS,
          endOfResult: true
        });
        if (direction)
          dispatch(
            notify({
              title: "You've reached the end of results",
              message: "",
              status: "info",
              dismissible: true,
              dismissAfter: 3000
            })
          );
      }
    } catch (error) {
      console.error(error);
    }
  };
}
