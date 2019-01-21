import axios from "axios";

export function getFeatureDocuments() {
  return axios.get(`/api/documents/feature`).then(res => res.data);
}
