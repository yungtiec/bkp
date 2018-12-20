import axios from "axios";

export function getCommentsByVersionId(doc_id) {
  return axios.get(`/api/documents/${doc_id}/comments`).then(res => res.data);
}

export function postComment({
  projectSymbol,
  versionId,
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .post(`/api/versions/${versionId}/comments`, {
      newComment,
      tags,
      issueOpen
    })
    .then(res => res.data);
}

export function postReplyToComment({
  projectSymbol,
  versionId,
  rootId,
  parentId,
  newComment
}) {
  return axios
    .post(`/api/versions/${versionId}/comments/${parentId}/reply`, {
      rootId,
      newComment
    })
    .then(res => res.data);
}

export function postUpvoteToComment({
  projectSymbol,
  versionId,
  commentId,
  hasUpvoted
}) {
  return axios
    .post(`/api/versions/${versionId}/comments/${commentId}/upvote`, {
      commentId,
      hasUpvoted
    })
    .then(res => res.data);
}

export function updateComment({
  projectSymbol,
  versionId,
  commentId,
  newComment,
  tags,
  issueOpen
}) {
  return axios
    .put(`/api/versions/${versionId}/comments/${commentId}/edit`, {
      newComment,
      tags,
      issueOpen
    })
    .then(res => res.data);
}

export function postPendingCommentStatus({ comment, reviewed }) {
  return axios.put(`/api/versions/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.put(`/api/versions/-/comments/${comment.id}/issue`, {
    open
  });
}
