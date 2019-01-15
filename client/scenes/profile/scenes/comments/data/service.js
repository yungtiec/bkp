import axios from "axios";

export function getUserComments({
  userId,
  offset,
  limit,
  projects,
  documents,
  reviewStatus = [],
  issueStatus = []
} = {}) {
  return axios
    .get(`/api/users/${userId}/comments`, {
      params: {
        offset,
        limit,
        projects,
        documents,
        reviewStatus,
        issueStatus
      }
    })
    .then(res => res.data);
}
