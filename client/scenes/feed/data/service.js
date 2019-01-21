import axios from "axios";

export function getFeatureDocuments() {
  return axios.get(`/api/documents/feature`).then(res => res.data);
}

export const getFilteredDocumentsWithStats = ({
  offset,
  limit,
  ...queries
}) => {
  return axios
    .get("/api/documents", {
      params: {
        offset,
        limit,
        ...queries
      }
    })
    .then(res => res.data);
};
