import * as types from "./actionTypes";
import { postHtml, getManagedProjects } from "./services";
import history from "../../../../history";
import { orderBy, keyBy } from "lodash";
import { loadModal, hideModal } from "../../../../data/reducer";

export const uploadHtmlToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      title,
      headerImageUrl,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProject,
      scorecard,
      indexDescription,
      summary,
      category,
      hasAnnotator,
      tags
    } = state.scenes.upload.data.upload;
    const document = await postHtml({
      title,
      headerImageUrl,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol: selectedProject.symbol || "GEN",
      scorecard,
      indexDescription,
      description: summary,
      category,
      hasAnnotator,
      tags
    });

    //history.push(`/s/${document.slug}`);
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
    return document;
  } catch (err) {
    console.log(err);
  }
};

export const updateCollaborators = collaboratorEmails => ({
  type: types.COLLABORATOR_UPDATED,
  collaboratorEmails
});

export const updateCommentPeriodUnit = commentPeriodUnit => ({
  type: types.COMMENT_PERIOD_UNIT_UPDATED,
  commentPeriodUnit
});

export const updateCommentPeriodValue = commentPeriodValue => ({
  type: types.COMMENT_PERIOD_VALUE_UPDATED,
  commentPeriodValue
});

export const updateSelectedProject = selectedProject => ({
  type: types.SELECTED_PROJECT_UPDATED,
  selectedProject
});

export const updateProjectScorecard = projectScorecard => ({
  type: types.PROJECT_SCORECARD_UPDATED,
  projectScorecard
});

export const updateContentHtml = contentHtml => ({
  type: types.CONTENT_HTML_UPDATED,
  contentHtml
});

export const updateSummary = summary => ({
  type: types.SUMMARY_UPDATED,
  summary
});

export const updateIndexDescription = indexDescription => ({
  type: types.INDEX_DESCRIPTION_UPDATED,
  indexDescription
});

export const updateTitle = title => ({
  type: types.TITLE_UPDATED,
  title
});

export const updateCategory = category => ({
  type: types.CATAGORY_UPDATED,
  category
});

export const updateTags = tags => ({
  type: types.TAGS_UPDATED,
  tags
});

export const updateHeaderImageUrl = headerImageUrl => ({
  type: types.HEADER_IMAGE_URL_UPDATED,
  headerImageUrl
});

export const updateHasAnnotator = hasAnnotator => ({
  type: types.HAS_ANNOTATOR_UPDATED,
  hasAnnotator
});

export const resetSubmitForm = hasAnnotator => ({
  type: types.RESET_SUBMIT_FORM,
  hasAnnotator
});

