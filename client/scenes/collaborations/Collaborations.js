import "./Collaborations.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListDocumentGrid } from "../../components";
import { Helmet } from "react-helmet";

const documentTypes = {
  general: "general",
  scorecard: "scorecard",
  regulatory: "regulatory",
  regulatoryForComment: "regulatory-for-comment"
};

const filterDocuments = (documentIds, documentsById) => {
  let scorecardsById = [];
  let scorecardIds = [];
  let thoughtLeadershipById = [];
  let thoughtLeadershipIds = [];
  let regulatoryById = [];
  let regulatoryIds = [];
  let regulatoryForCommentById = [];
  let regulatoryForCommentIds = [];

  for (let id in documentIds) {
    const docId = documentIds[id];
    const document = documentsById[docId];
    const documentObj = {};
    documentObj[docId] = document;
    if (document.document_type === documentTypes.scorecard) {
      scorecardIds = [].concat(scorecardIds).concat([docId]);
      scorecardsById = Object.assign({}, scorecardsById, documentObj);
    } else if (document.document_type === documentTypes.regulatory) {
      regulatoryIds = [].concat(regulatoryIds).concat([docId]);
      regulatoryById = Object.assign({}, regulatoryById, documentObj);
    } else if (document.document_type === documentTypes.regulatoryForComment) {
      regulatoryForCommentIds  = [].concat(regulatoryForCommentIds).concat([docId]);
      regulatoryForCommentById = Object.assign({}, regulatoryForCommentById, documentObj);
    } else {
      thoughtLeadershipIds = [].concat(thoughtLeadershipIds).concat([docId]);
      thoughtLeadershipById = Object.assign(
        {},
        thoughtLeadershipById,
        documentObj
      );
    }
  }

  return {
    scorecardsById,
    scorecardIds,
    thoughtLeadershipById,
    thoughtLeadershipIds,
    regulatoryById,
    regulatoryIds,
    regulatoryForCommentIds,
    regulatoryForCommentById
  };
};

export default ({
  projectsBySymbol,
  projectSymbolArr,
  documentsById,
  documentIds,
  loadModal,
  hideModal,
  notify
}) => {
  const {
    scorecardsById,
    scorecardIds,
    thoughtLeadershipById,
    thoughtLeadershipIds,
    regulatoryById,
    regulatoryIds,
    regulatoryForCommentIds,
    regulatoryForCommentById
  } = filterDocuments(documentIds, documentsById);

  return (
    <div>
      <Helmet>
        <title>The Brooklyn Project | Collaborate</title>
      </Helmet>
      <div className="main-container-collaborations">
        <div className="projects-containers__collaboration-container">
          <div className="projects-containers__collaboration-header-mobile">
            <span className="collaborations-header">Open Collaborations</span>
          </div>
          <div className="btn-container-flex">
            <div className="btn-container">
              <button
                className="btn btn-outline-primary btn-telegram"
              >
                <a
                  href="https://t.me/joinchat/HRhhQEvAeC2t4wiYHquYUg"
                  target="_blank"
                  className="navbar__nav-item"
                >Telegram</a>
              </button>
              <button
                className="btn btn-outline-primary btn-propose"
                onClick={() =>
                  loadModal("COLLABORATION_PROPOSAL_MODAL", {
                    hideModal,
                    notify
                  })
                }
              >
                Propose collaboration
              </button>
            </div>
          </div>
        </div>
        <div className="collaborations-container col-md-7">
          <div className="projects-containers__collaboration-header">
            <span className="collaborations-header">Open Collaborations</span>
          </div>
          {regulatoryForCommentIds && regulatoryForCommentIds.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Regulatory Requests for Comment</div>
                <div className="btn-propose-container">
                  <button
                    className="btn btn-outline-primary btn-propose"
                    onClick={() =>
                      loadModal("COLLABORATION_PROPOSAL_MODAL", {
                        hideModal,
                        notify
                      })
                    }
                  >
                    Propose collaboration
                  </button>
                </div>
              </div>
              <ListDocumentGrid
                documentIds={regulatoryForCommentIds}
                documentsById={regulatoryForCommentById}
              />
            </div>
          ) : null}
          {regulatoryIds && regulatoryIds.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Regulatory Notices</div>
              </div>
              <ListDocumentGrid
                documentIds={regulatoryIds}
                documentsById={regulatoryById}
              />
            </div>
          ) : null}
          {thoughtLeadershipIds && thoughtLeadershipIds.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Thought Leadership</div>
              </div>
              <ListDocumentGrid
                documentIds={thoughtLeadershipIds}
                documentsById={thoughtLeadershipById}
              />
            </div>
          ) : null}
          {scorecardIds && scorecardIds.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Transparency Scorecards</div>
              </div>
              <ListDocumentGrid
                documentIds={scorecardIds}
                documentsById={scorecardsById}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
