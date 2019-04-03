import axios from "axios";

export function postQuestion(question) {
  return axios.post(`/api/questions`, question).then(res => res.data);
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
