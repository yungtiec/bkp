import axios from "axios";

export default function getOwnFeaturedDocuments({ offset, limit }) {
  return axios
    .get(`/api/documents/featured`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}

