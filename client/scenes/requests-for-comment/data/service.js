import axios from "axios";

export function postQuestion(question) {
  return axios.post(`/api/questions`, question).then(res => res.data);
}

export function getQuestionBySlug(questionId) {
  return axios.get(`/api/questions/${questionId}`).then(res => res.data);
}

export const getFilteredQuestions = ({ offset, limit, ...queries }) => {
  return axios
    .get("/api/questions", {
      params: {
        offset,
        limit,
        ...queries
      }
    })
    .then(res => res.data);
};

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
