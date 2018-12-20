import axios from "axios";

export const getLastestDocumentsWithStats = ({ offset, limit, hasLimit }) => {
  if (!hasLimit) {
    return axios
      .get("/api/documents")
      .then(res => res.data);
  }
  return axios
    .get("/api/documents", {
      params : {
        offset,
        limit
      }
    })
    .then(res => res.data);
};
