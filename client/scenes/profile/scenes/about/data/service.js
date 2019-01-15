import axios from "axios";

export function getUserBasicInfo(userId) {
  return axios.get(`/api/users/${userId}`).then(res => res.data);
}

export function postAccessStatus({ userId, accessStatus }) {
  return axios
    .post(`/admin/users/${userId}/access`, {
      accessStatus
    })
    .then(res => res.data);
}

export function putAnonymity() {
  return axios.put(`/auth/profile/anonymity`).then(res => res.data);
}
