import axios from "axios";

export function getUserVotes({ userHandle, offset, limit }) {
  return axios
    .get(`/api/users/${userHandle}/votes`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
