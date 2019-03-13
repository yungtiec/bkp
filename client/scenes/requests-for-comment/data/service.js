import axios from "axios";

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
