import axios from "axios";

export function getUserDocuments({ userHandle, offset, limit }) {
  return axios
    .get(`/api/users/${userHandle}/documents`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
