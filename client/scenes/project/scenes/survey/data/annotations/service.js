import axios from "axios";

export function getAnnotationsBySurvey(projectSurveyId) {
  return axios
    .get("/api/annotation", {
      params: {
        projectSurveyId
      }
    })
    .then(res => res.data);
}

export function postComment({ projectSurveyId, comment, tags, issueOpen }) {
  return axios
    .post("/api/annotation", { projectSurveyId, comment, tags, issueOpen })
    .then(res => res.data);
}

export function postReplyToAnnotation({ rootId, parentId, comment }) {
  return axios
    .post("/api/annotation/reply", { rootId, parentId, comment })
    .then(res => res.data);
}

export function postUpvoteToAnnotation({ annotationId, hasUpvoted }) {
  return axios
    .post("/api/annotation/upvote", { annotationId, hasUpvoted })
    .then(res => res.data);
}

export function updateAnnotationComment({
  annotationId,
  comment,
  tags,
  issueOpen
}) {
  return axios
    .post("/api/annotation/edit", { annotationId, comment, tags, issueOpen })
    .then(res => res.data);
}

export function postPendingAnnotationStatus({ engagementItem, reviewed }) {
  return axios.post("/api/admin/engagement-item/verify", {
    engagementItem: engagementItem,
    reviewed
  });
}

export function updateAnnotationIssueStatus({ annotation, open }) {
  return axios.post("/api/admin/engagement-item/issue", {
    engagementItem: annotation,
    open
  });
}
