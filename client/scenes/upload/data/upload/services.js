import axios from "axios";

export function postHtml({
  title,
  headerImageUrl,
  contentHtml,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard,
  category,
  description,
  // todo: add input for document type: regulatory...etc
  documentType
}) {
  return axios
    .post(`/api/documents`, {
      title,
      headerImageUrl,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard,
      documentFormat: "html",
      category,
      description,
      documentType
    })
    .then(res => res.data);
}
