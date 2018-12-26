import axios from "axios";

export function getUserContributions({ userHandle, offset, limit }) {
  return axios
    .get(`/api/users/${userHandle}/contributions`, {
      params: {
        offset,
        limit
      }
    })
    .then(res => res.data);
}
