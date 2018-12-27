import * as types from "./actionTypes";
import { values, keyBy, assignIn } from "lodash";
import { getUserComments } from "./service";
import { getUserCommentsOffsetAndLimit } from "./reducer";
import { notify } from "reapop";

export function fetchUserComments(userHandle, direction) {
  return async (dispatch, getState) => {
    try {
      var { offset, limit } = getUserCommentsOffsetAndLimit(getState());
      if (direction) {
        offset = direction > 0 ? offset + limit : offset - limit;
      }
      const comments = await getUserComments({ userHandle, offset, limit });
      const commentsById = keyBy(comments, "id");
      const commentIds = comments.map(i => i.id);
      if (commentIds.length)
        dispatch({
          type: types.USER_COMMENTS_FETCH_SUCCESS,
          commentsById,
          commentIds,
          offset,
          endOfResult: commentIds.length < limit
        });
      else {
        dispatch({
          type: types.USER_COMMENTS_FETCH_SUCCESS,
          endOfResult: true
        });
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
