import axios from "axios";

export function getUserContributions(userHandle) {
  return axios
    .get(`/api/users/${userHandle}/contributions`)
    .then(res => res.data);
}
