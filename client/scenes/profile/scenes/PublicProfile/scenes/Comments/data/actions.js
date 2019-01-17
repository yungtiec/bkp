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
      } else {
        offset = 0;
      }
      const results = await getUserComments({ userHandle, offset, limit });
      const comments = results[0];
      const commentsById = keyBy(comments, "comment_id");
      const commentIds = comments.map(i => i.comment_id);
      if (commentIds.length)
        dispatch({
          type: types.USER_COMMENTS_FETCH_SUCCESS,
          commentsById,
          commentIds,
          offset,
          endOfResult: commentIds.length < limit
        });
      else {
        if (!direction) {
          // empty profile page where user has no contribution
          dispatch({
            type: types.USER_COMMENTS_FETCH_SUCCESS,
            commentsById: null,
            commentIds: null,
            endOfResult: true
          });
        } else {
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
      }
    } catch (error) {
      console.error(error);
    }
  };
}
