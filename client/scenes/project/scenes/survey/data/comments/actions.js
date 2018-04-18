import {
  getCommentsBySurvey,
  postComment,
  postReplyToComment,
  postUpvoteToComment,
  updateComment,
  postPendingCommentStatus
} from "./service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep, values } from "lodash";
import { notify } from "reapop";
import { findItemInTreeById } from "../utils";

export const fetchCommentsBySurvey = projectSurveyId => {
  return async dispatch => {
    try {
      const comments = await getCommentsBySurvey(projectSurveyId);
      const commentsById = keyBy(comments, "id");
      dispatch({
        type: types.COMMENTS_FETCH_SUCCESS,
        commentsById: comments.length ? commentsById : {}
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewComment = ({ projectSurveyId, comment }) => {
  return async dispatch => {
    try {
      const postedComment = await postComment({ projectSurveyId, comment });
      dispatch({
        type: types.COMMENT_ADDED,
        comment: postedComment
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const initiateReplyToComment = ({ accessors, parent }) => {
  return (dispatch, getState) => {
    const {
      commentsById
    } = getState().scenes.project.scenes.survey.data.comments;
    const ancestorIsSpam = accessors
      .map(cid => findItemInTreeById(values(commentsById), cid))
      .reduce((bool, item) => item.reviewed === "spam" || bool, false);

    if (!ancestorIsSpam)
      dispatch({
        type: types.COMMENT_REPLY_INIT,
        accessors,
        parent
      });
    else
      dispatch(
        notify({
          title: "Something went wrong",
          message: "Can't reply to spam message",
          status: "error",
          dismissible: true,
          dismissAfter: 3000
        })
      );
  };
};

export const cancelReplyToComment = ({ accessors, parent }) => ({
  type: types.COMMENT_REPLY_CANCEL,
  accessors,
  parent
});

export const replyToComment = ({ parentId, comment }) => {
  return async (dispatch, getState) => {
    try {
      const rootComment = await postReplyToComment({
        parentId,
        comment
      });
      dispatch({
        type: types.COMMENT_UPDATED,
        rootComment
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const upvoteComment = ({ itemId, hasUpvoted }) => {
  return async dispatch => {
    try {
      const { upvotesFrom, commentId } = await postUpvoteToComment({
        commentId: itemId,
        hasUpvoted
      });
      dispatch({
        type: types.COMMENT_UPVOTED,
        upvotesFrom,
        commentId
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editComment = ({ commentId, comment }) => {
  return async dispatch => {
    try {
      const rootComment = await updateComment({
        commentId,
        comment
      });
      dispatch({
        type: types.COMMENT_UPDATED,
        rootComment
      });
      dispatch({
        type: "modal.HIDE_MODAL"
      });
    } catch (err) {
      if (err.message.indexOf("code 500") !== -1) {
        dispatch(
          notify({
            title: "Something went wrong",
            message: "Please try again later",
            status: "error",
            dismissible: true,
            dismissAfter: 3000
          })
        );
      }
    }
  };
};

export const verifyCommentAsAdmin = (commentId, reviewed) => {
  return async dispatch => {
    try {
      await postPendingCommentStatus({
        commentId,
        reviewed
      });
      dispatch({
        type: types.COMMENT_VERIFIED,
        commentId,
        reviewed
      });
    } catch (err) {
      console.log(err);
    }
  };
};
