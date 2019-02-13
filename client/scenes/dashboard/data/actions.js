import { values, keyBy } from "lodash";
import * as types from "./actionTypes";
import { getDocumentsWithStats, getCommentsWithResponse } from "./service";

export const fetchDocumentsWithStats = loadMore => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    if (!loadMore) {
      dispatch({
        type: types.DOCUMENTS_REQUESTED
      });
    } else {
      dispatch({
        type: types.ADDITIONAL_DOCUMENTS_REQUESTED
      });
    }
    var documents = await getDocumentsWithStats({
      offset: state.scenes.dashboard.data.documentOffset,
      loadMore
    });
    const documentsById = keyBy(documents, "id");
    const documentIds = documents.map(fd => fd.id);
    dispatch({
      type: types.DOCUMENTS_FETCH_SUCESSS,
      documentsById,
      documentIds,
      loadMore
    });
  } catch (err) {
    console.log(err);
  }
};

export const fetchCommentsWithResponse = loadMore => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    var { commentOffset, commentLimit } = state.scenes.dashboard.data;

    if (!loadMore) {
      commentOffset = 0;
      dispatch({
        type: types.COMMENTS_REQUESTED
      });
    } else {
      dispatch({
        type: types.ADDITIONAL_COMMENTS_REQUESTED
      });
    }
    var comments = await getCommentsWithResponse({
      offset: commentOffset,
      limit: commentLimit
    });
    const commentsById = keyBy(comments, "id");
    const commentIds = comments.map(fd => fd.id);
    dispatch({
      type: types.COMMENTS_FETCH_SUCESSS,
      commentsById,
      commentIds,
      commentOffset: commentOffset + commentLimit,
      commentEndOfResult:
        commentIds.length < commentLimit || !commentIds.length,
      loadMore
    });
  } catch (err) {
    console.log(err);
  }
};
