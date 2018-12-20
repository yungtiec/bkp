import {
  getCommentsByVersionId,
  postReplyToComment,
  postUpvoteToComment,
  updateComment,
  postPendingCommentStatus,
  updateCommentIssueStatus,
  postComment
} from "./service";
import { getAllTags } from "../tags/service";
import * as types from "./actionTypes";
import { keyBy, omit, assignIn, pick, cloneDeep, values, maxBy } from "lodash";
import { notify } from "reapop";
import history from "../../../../history";

export const fetchCommentsByVersionId = docId => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: types.COMMENTS_FETCH_REQUEST
      });
      const comments = await getCommentsByVersionId(docId);
      const tags = await getAllTags();
      const commentsById = keyBy(comments, "id");
      dispatch({
        type: types.COMMENTS_FETCH_SUCCESS,
        commentsById,
        tags
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewComment = ({ versionId, newComment, tags, issueOpen }) => {
  return async (dispatch, getState) => {
    try {
      const projectSymbol = getState().scenes.document.data.documentMetadata
        .project.symbol;
      const postedComment = await postComment({
        projectSymbol,
        versionId,
        newComment,
        tags,
        issueOpen
      });
      dispatch({
        type: types.COMMENT_ADDED,
        comment: postedComment
      });
      history.push(
        `/project/${projectSymbol}/document/${
          postedComment.version.document.id
        }/version/${versionId}/comment/${postedComment.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewCommentSentFromServer = comment => {
  return (dispatch, getState) => {
    try {
      const projectSymbol = getState().scenes.document.data.documentMetadata
        .project.symbol;
      const versionId = getState().scenes.document.data.versionMetadata.id;
      dispatch({
        type: types.COMMENT_ADDED,
        comment
      });
      history.push(
        `/project/${projectSymbol}/document/${
          comment.version.document.id
        }/version/${versionId}/comment/${comment.id}`
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const cancelReplyToComment = ({ accessors, parent }) => ({
  type: types.COMMENT_REPLY_CANCEL,
  accessors,
  parent
});

export const replyToComment = ({ rootId, parentId, newComment, versionId }) => {
  return async (dispatch, getState) => {
    try {
      const rootComment = await postReplyToComment({
        projectSymbol: getState().scenes.document.data.documentMetadata.project
          .symbol,
        versionId,
        rootId,
        parentId,
        newComment
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

export const upvoteComment = ({ rootId, comment, hasUpvoted }) => {
  return async (dispatch, getState) => {
    try {
      const { commentId, upvotesFrom } = await postUpvoteToComment({
        projectSymbol: getState().scenes.document.data.documentMetadata.project
          .symbol,
        versionId: comment.version_id,
        commentId: comment.id,
        hasUpvoted
      });
      dispatch({
        type: types.COMMENT_UPVOTED,
        commentId,
        rootId,
        upvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const editComment = ({
  versionId,
  commentId,
  newComment,
  tags,
  issueOpen
}) => {
  return async (dispatch, getState) => {
    try {
      const rootComment = await updateComment({
        projectSymbol: getState().scenes.document.data.documentMetadata.project
          .symbol,
        versionId,
        commentId,
        newComment,
        tags,
        issueOpen
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

export const verifyCommentAsAdmin = ({ comment, rootId, reviewed }) => {
  return async dispatch => {
    try {
      await postPendingCommentStatus({
        comment,
        reviewed
      });
      dispatch({
        type: types.COMMENT_VERIFIED,
        commentId: comment.id,
        reviewed,
        rootId
      });
    } catch (err) {
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
  };
};

export const changeCommentIssueStatus = comment => {
  return async (dispatch, getState) => {
    try {
      const user = getState().data.user;
      const open = comment.issue ? !comment.issue.open : true;
      await updateCommentIssueStatus({
        comment,
        open
      });
      dispatch({
        type: types.COMMENT_ISSUE_UPDATED,
        commentId: comment.id,
        open
      });
    } catch (err) {
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
  };
};
