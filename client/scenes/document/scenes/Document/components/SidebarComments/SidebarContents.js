import React, { Component } from "react";
import autoBind from "react-autobind";
import { connect } from "react-redux";
import { CommentContainer } from "../../../../../../components";
import { Link as ScrollLink, Element } from "react-scroll";
import {
  replyToComment,
  initiateReplyToComment,
  cancelReplyToComment,
  upvoteComment,
  verifyCommentAsAdmin,
  editComment,
  changeCommentIssueStatus
} from "../../../../data/comments/actions";
import { loadModal, hideModal } from "../../../../../../data/reducer";
import { notify } from "reapop";

const SidebarContents = props => {
  if (
    props.commentIds &&
    // props.selectedText &&
    props.selectedComments &&
    props.selectedComments.length
  ) {
    return renderSidebarWithSelectedComments(props);
  }
  if (
    props.commentIds &&
    (!props.selectedComments ||
      (props.selectedComments && !props.selectedComments.length))
  ) {
    return renderSidebarWithAllComments(props);
  }
};

function renderSidebarWithSelectedComments(props) {
  const {
    isClosedForComment,
    selectedComments,
    commentsById,
    projectMetadata,
    selectedText,
    parent,
    replyToComment,
    initiateReplyToComment,
    cancelReplyToComment,
    verifyCommentAsAdmin,
    upvoteComment,
    editComment,
    changeCommentIssueStatus,
    loadModal,
    notify,
    user,
    isLoggedIn,
    admin
  } = props;
  return (
    <div>
      {selectedComments
        // .filter(a => commentsById[a.id].reviewed !== "spam")
        .map(comment => (
          <CommentContainer
            key={`comment-${comment.id}`}
            isClosedForComment={isClosedForComment}
            comment={comment}
            projectMetadata={projectMetadata}
            replyToItem={replyToComment}
            verifyItemAsAdmin={verifyCommentAsAdmin}
            upvoteItem={upvoteComment}
            editItem={editComment}
            changeItemIssueStatus={changeCommentIssueStatus}
            loadModal={loadModal}
            hideModal={hideModal}
            notify={notify}
            user={user}
            isLoggedIn={isLoggedIn}
          />
        ))}
    </div>
  );
}

function renderSidebarWithAllComments(props) {
  const {
    collaboratorsArray,
    commentIds,
    commentsById,
    projectMetadata,
    isClosedForComment,
    selectedText,
    parent,
    replyToComment,
    initiateReplyToComment,
    cancelReplyToComment,
    verifyCommentAsAdmin,
    upvoteComment,
    editComment,
    changeCommentIssueStatus,
    loadModal,
    notify,
    user,
    isLoggedIn,
    admin
  } = props;
  return (
    commentIds
      // .filter(id => commentsById[id].reviewed !== "spam")
      .map(id => {
        return (
          <CommentContainer
            collaboratorsArray={collaboratorsArray}
            key={`comment-${id}`}
            isClosedForComment={isClosedForComment}
            comment={commentsById[id]}
            projectMetadata={projectMetadata}
            user={user}
            replyToItem={replyToComment}
            verifyItemAsAdmin={verifyCommentAsAdmin}
            upvoteItem={upvoteComment}
            editItem={editComment}
            changeItemIssueStatus={changeCommentIssueStatus}
            loadModal={loadModal}
            hideModal={hideModal}
            notify={notify}
            user={user}
            isLoggedIn={isLoggedIn}
            admin={admin}
          />
        );
      })
  );
}

const mapState = (state, ownProps) => ({
  user: state.data.user,
  admin:
    !!state.data.user.roles &&
    state.data.user.roles.filter(r => r.name === "admin").length,
  ...ownProps
});

const actions = {
  replyToComment,
  initiateReplyToComment,
  cancelReplyToComment,
  verifyCommentAsAdmin,
  upvoteComment,
  editComment,
  changeCommentIssueStatus,
  loadModal,
  hideModal,
  notify
};

export default connect(
  mapState,
  actions
)(SidebarContents);
