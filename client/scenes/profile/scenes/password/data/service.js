import axios from "axios";

export function putUserPassword(myUserId, currentPassword, newPassword) {
  const id = myUserId;
  return axios
    .put(`/auth/profile/update-password/`, {
      id,
      currentPassword,
      newPassword
    })
}
