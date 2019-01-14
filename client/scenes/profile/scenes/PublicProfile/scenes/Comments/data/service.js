import axios from "axios";

export function getUserComments({ userHandle, offset, limit }) {
  return axios
    .get(`/api/users/${userHandle}/comments`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
