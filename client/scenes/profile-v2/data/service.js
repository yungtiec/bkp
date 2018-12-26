import axios from "axios";

export function getUserProfile(userHandle) {
  return axios.get(`/api/users/${userHandle}`).then(res => res.data);
}

