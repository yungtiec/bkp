import axios from "axios";

export function getMetadataByDocumentId(documentId) {
  return axios.get(`/api/documents/${documentId}`).then(res => res.data);
}

export function getMetadataBySlug(slug) {
  return axios.get(`/api/documents/slug/${slug}`).then(res => {
    return res.data
  });
}

export function putContentHTMLBySlug(slug, {content, status, category, headerImageUrl}) {
  return axios.put(`/api/documents/slug/${slug}`, {
    contentHTML: content,
    status,
    category,
    headerImageUrl
  }).then(res => {
    return res.data
  });
}

export function postUpvoteToDocument({
  documentId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/documents/${documentId}/upvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}

export function postDownvoteToDocument({
  documentId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return axios
    .post(`/api/documents/${documentId}/downvote`, {
      hasUpvoted,
      hasDownvoted
    })
    .then(res => res.data);
}
