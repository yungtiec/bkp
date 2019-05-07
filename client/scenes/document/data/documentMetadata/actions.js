import { maxBy } from "lodash";
import * as types from "./actionTypes";
import {
  getMetadataByDocumentId,
  getMetadataBySlug,
  postUpvoteToDocument,
  postDownvoteToDocument,
  putContentHTMLBySlug
} from "./service";
import { loadModal } from "../../../../data/reducer";
import history from "../../../../history";

export function fetchMetadataByDocumentId(documentId, versionId) {
  return async (dispatch, getState) => {
    try {
      var documentMetadata = await getMetadataByDocumentId(documentId);
      dispatch({
        type: types.DOCUMENT_METADATA_FETCH_SUCCESS,
        documentMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function resetDocumentMetadata() {
  return {
    type: types.DOCUMENT_METADATA_RESET
  };
}

export function fetchMetadataBySlug(slug, versionId) {
  return async (dispatch, getState) => {
    try {
      var documentMetadata = await getMetadataBySlug(slug);
      dispatch({
        type: types.DOCUMENT_METADATA_FETCH_SUCCESS,
        documentMetadata
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateContentHTMLBySlug(slug, propertiesToUpdate, hideEditor) {
  return async (dispatch, getState) => {
    try {
      var documentMetadata = await putContentHTMLBySlug(
        slug,
        propertiesToUpdate
      );
      dispatch({
        type: types.DOCUMENT_CONTENT_HTML_UPDATE_SUCCESS,
        documentMetadata
      });
      hideEditor();
      if (slug !== documentMetadata.slug) {
        history.push(`/s/${documentMetadata.slug}`)
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function downvoteDocument({
  documentId,
  versionId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postDownvoteToDocument({
        documentId,
        projectSymbol,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.SURVEY_VOTED,
        upvotesFrom,
        downvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function upvoteDocument({
  documentId,
  versionId,
  projectSymbol,
  hasUpvoted,
  hasDownvoted
}) {
  return async (dispatch, getState) => {
    try {
      const [upvotesFrom, downvotesFrom] = await postUpvoteToDocument({
        documentId,
        projectSymbol,
        hasUpvoted,
        hasDownvoted
      });
      dispatch({
        type: types.SURVEY_VOTED,
        upvotesFrom,
        downvotesFrom
      });
    } catch (err) {
      console.log(err);
    }
  };
}
