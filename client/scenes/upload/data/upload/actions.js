import * as types from "./actionTypes";
import { postHtml, getManagedProjects } from "./services";
import history from "../../../../history";
import { orderBy, keyBy } from "lodash";

export const uploadHtmlToServer = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      title,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProject,
      scorecard
    } = state.scenes.upload.data.upload;
    const document = await postHtml({
      title,
      contentHtml,
      collaboratorEmails,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProjectSymbol: selectedProject.symbol,
      scorecard
    });
    history.push(
      `/s/${document.slug}`
    );
    dispatch({
      type: types.MARKDOWN_UPLOADED
    });
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

export const updateTitle = title => ({
  type: types.TITLE_UPDATED,
  title
});
