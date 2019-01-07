import axios from "axios";

export function getUserProfile(userHandle) {
  return axios.get(`/api/users/${userHandle}`).then(res => res.data);
}

export function putUserProfile(profile) {
  return axios.put(`/auth/profile`, profile).then(res => res.data);
}

export function putUserAccount(account) {
  return axios
    .put(`/auth/accounts/update-account`, account)
    .then(res => res.data);
}

export function putUserPassword(passwordObject) {
  return axios.put(`/auth/accounts/update-password/`, passwordObject);
}
