import * as types from "./actionTypes";
import { getSurveyByProjectSurveyId } from "./service";
import { keyBy, omit, assignIn, pick } from "lodash";

export function fetchQuestionsByProjectSurveyId({ projectSurveyId }) {
  return async (dispatch, getState) => {
    try {
      const projectSurvey = await getSurveyByProjectSurveyId(projectSurveyId);
      const surveyQnas = projectSurvey.survey.survey_questions;
      const surveyQnasById = keyBy(surveyQnas, "id");
      const surveyQnaIds = surveyQnas.map(qna => qna.id);
      const surveyMetadata = assignIn(
        pick(projectSurvey, ["title", "description", "id", "creator"]),
        omit(projectSurvey.survey, ["survey_questions"])
      );
      dispatch({
        type: types.SURVEY_FETCH_SUCCESS,
        surveyQnasById,
        surveyQnaIds,
        surveyMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}
