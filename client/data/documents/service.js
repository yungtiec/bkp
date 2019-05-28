import axios from "axios";

export const getLastestDocumentsWithStats = ({ offset, limit, hasLimit }) => {
  if (!hasLimit) {
    return axios
      .get("/api/documents/all")
      .then(res => res.data);
  }
  return axios
    .get("/api/documents/all", {
      params : {
        offset,
        limit
      }
    })
    .then(res => res.data);
};
