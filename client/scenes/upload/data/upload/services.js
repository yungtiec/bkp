import axios from "axios";

export function postHtml({
  title,
  headerImageUrl,
  indexDescription,
  contentHtml,
  collaboratorEmails,
  commentPeriodValue,
  commentPeriodUnit,
  selectedProjectSymbol,
  scorecard,
  category,
  description,
  tags,
  hasAnnotator,
  // todo: add input for document type: regulatory...etc
  documentType
}) {
  return axios
    .post(`/api/documents`, {
      title,
      headerImageUrl,
      indexDescription,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol,
      scorecard,
      documentFormat: "html",
      category,
      tags,
      description,
      hasAnnotator,
      documentType
    })
    .then(res => res.data);
}
