import axios from "axios";

export function getUserProfile(userHandle) {
  return axios.get(`/api/users/${userHandle}`).then(res => res.data);
}

export function putUserProfile(profile) {
  return axios.put(`/auth/profile`, profile).then(res => res.data);
}

