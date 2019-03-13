import axios from "axios";

export function getCommentsByVersionId(doc_id) {
  return axios.get(`/api/documents/${doc_id}/comments`).then(res => res.data);
}

export function postComment({
  documentId,
  newComment,
  selectedTags,
  issueOpen
}) {
  return axios
    .post(`/api/documents/${documentId}/comments`, {
      newComment,
      selectedTags,
      issueOpen
    })
    .then(res => res.data);
}

export function postReplyToComment({
  projectSymbol,
  documentId,
  parentId,
  newComment
}) {
  return axios
    .post(`/api/documents/${documentId}/comments/${parentId}/reply`, {
      newComment
    })
    .then(res => res.data);
}

export function postUpvoteToComment({
  projectSymbol,
  documentId,
  commentId,
  hasUpvoted
}) {
  return axios
    .post(`/api/documents/${documentId}/comments/${commentId}/upvote`, {
      commentId,
      hasUpvoted
    })
    .then(res => res.data);
}

export function updateComment({
  projectSymbol,
  documentId,
  commentId,
  newComment,
  selectedTags,
  issueOpen
}) {
  return axios
    .put(`/api/documents/${documentId}/comments/${commentId}/edit`, {
      newComment,
      selectedTags,
      issueOpen
    })
    .then(res => res.data);
}

export function postPendingCommentStatus({ comment, reviewed }) {
  return axios.put(`/api/documents/-/comments/${comment.id}/verify`, {
    reviewed
  });
}

export function updateCommentIssueStatus({ comment, open }) {
  return axios.put(`/api/documents/-/comments/${comment.id}/issue`, {
    open
  });
}
