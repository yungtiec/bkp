import axios from "axios";

export function postHtml({
  title,
  contentHtml,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard,
  // todo: add input for document type: regulatory...etc
  documentType
}) {
  return axios
    .post(`/api/documents`, {
      title,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard,
      documentFormat: "html",
      documentType
    })
    .then(res => res.data);
}
