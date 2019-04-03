import axios from "axios";

export function getQuestionBySlug(questionId) {
  return axios.get(`/api/questions/${questionId}`).then(res => res.data);
}

export function postUpvoteToQuestion({ questionId, hasUpvoted, hasDownvoted }) {
  return axios
    .post(`/api/questions/${questionId}/upvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postDownvoteToQuestion({
  questionId,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/questions/${questionId}/downvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postComment({ questionId, newComment, selectedTags }) {
  return axios
    .post(`/api/questions/${questionId}/comments`, {
      newComment,
      selectedTags
    })
    .then(res => res.data);
}

export function getCommentsByQuestionId({
  questionSlug,
  offset,
  limit,
  ...queries
}) {
  return axios
    .get(`/api/questions/${questionSlug}/comments`, {
      params: {
        offset,
        limit,
        ...queries
      }
    })
    .then(res => res.data);
}

export function postReplyToComment({ questionId, parentId, newComment }) {
  return axios
    .post(`/api/questions/${questionId}/comments/${parentId}/reply`, {
      newComment
    })
    .then(res => res.data);
}

export function postUpvoteToComment({ questionId, commentId, hasUpvoted }) {
  return axios
    .post(`/api/questions/${questionId}/comments/${commentId}/upvote`, {
      commentId,
      hasUpvoted
    })
    .then(res => res.data);
}

export function putQuestionBySlug({
  question,
  title,
  description,
  owner,
  selectedTags
}) {
  return axios
    .put(`/api/questions/${question.id}`, {
      title,
      description,
      owner,
      selectedTags
    })
    .then(res => res.data);
}

export function putComment({
  questionId,
  commentId,
  newComment,
  selectedTags
}) {
  return axios
    .put(`/api/questions/${questionId}/comments/${commentId}/edit`, {
      newComment,
      selectedTags
    })
    .then(res => res.data);
}
