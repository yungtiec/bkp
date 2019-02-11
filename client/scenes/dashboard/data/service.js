import axios from "axios";

export const getDocumentsWithStats = ({ loadMore, offset }) =>
  axios
    .get("/api/documents", {
      params: {
        offset: loadMore ? offset : 0,
        limit: loadMore ? null : offset
      }
    })
    .then(res => res.data);

export const getCommentsWithResponse = ({ offset, limit }) =>
  axios
    .get("/api/comments", {
      params: { offset, limit }
    })
    .then(res => res.data);
