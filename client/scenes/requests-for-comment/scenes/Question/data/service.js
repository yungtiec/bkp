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
