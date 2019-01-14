import "./Collaborations.scss";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListProject, ListDocumentGrid } from "../../components";
import { Helmet } from "react-helmet";

const documentCategory = {
  general: "general",
  scorecard: "scorecard",
  regulatory: "regulatory",
  regulatoryForComment: "regulatory-for-comment",
  proposedLawsRegulations: "proposed-laws-regulations"
};

const filterDocuments = (documents) => {
  let scorecardsArr = [];
  let thoughtLeadershipArr = [];
  let regulatoryArr = [];
  let regulatoryForCommentArr = [];
  let proposedLawsRegulationsArr = [];
  console.log(documents);
  documents.forEach((document) => {
    console.log({document});
    if (document.category === documentCategory.scorecard) {
      scorecardsArr = [].concat(scorecardsArr).concat([document]);
    } else if (document.document_type === documentCategory.regulatory) {
      regulatoryArr = [].concat(regulatoryArr).concat([document]);
    } else if (document.document_type === documentCategory.regulatoryForComment) {
      regulatoryForCommentArr  = [].concat(regulatoryForCommentArr).concat([document]);
    } else if (document.document_type === documentCategory.proposedLawsRegulations) {
      proposedLawsRegulationsArr  = [].concat(proposedLawsRegulationsArr).concat([document]);
    } else {
      thoughtLeadershipArr = [].concat(thoughtLeadershipArr).concat([document]);
    }
  });

  return {
    scorecardsArr,
    regulatoryArr,
    regulatoryForCommentArr,
    thoughtLeadershipArr,
    proposedLawsRegulationsArr
  };
};

export default ({
  projectsBySymbol,
  projectSymbolArr,
  documents,
  loadModal,
  hideModal,
  notify
}) => {
  const {
    scorecardsArr,
    regulatoryArr,
    regulatoryForCommentArr,
    thoughtLeadershipArr,
    proposedLawsRegulationsArr
  } = filterDocuments(documents);

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
          {proposedLawsRegulationsArr.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Proposed Laws And Regulations</div>
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
                documents={proposedLawsRegulationsArr}
              />
            </div>
          ) : null}
          {regulatoryForCommentArr.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Regulatory Requests for Comment</div>
              </div>
              <ListDocumentGrid
                documents={regulatoryForCommentArr}
              />
            </div>
          ) : null}
          {regulatoryArr.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Regulatory Notices</div>
              </div>
              <ListDocumentGrid
                documents={regulatoryArr}
              />
            </div>
          ) : null}
          {thoughtLeadershipArr.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Thought Leadership</div>
              </div>
              <ListDocumentGrid
                documents={thoughtLeadershipArr}
              />
            </div>
          ) : null}
          {scorecardsArr.length ? (
            <div className="project-row">
              <div className="projects-containers__collaboration-sub-header d-flex justify-content-between">
                <div className="collaborate-header">Transparency Scorecards</div>
              </div>
              <ListDocumentGrid
                documents={scorecardsArr}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
