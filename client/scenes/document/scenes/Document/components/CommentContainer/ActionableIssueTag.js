import React, { Component } from "react";
import {
  PunditContainer,
  PunditTypeSet,
  IfElseButton,
  VisibleIf
} from "react-pundit";
import policies from "../../../../../../policies.js";
import { connect } from "react-redux";

const ActionableIssueTag = ({
  user,
  projectMetadata,
  comment,
  changeItemIssueStatus
}) => (
  <PunditContainer policies={policies} user={user}>
    <PunditTypeSet type="Comment">
      {comment.issue &&
        (comment.issue.open ? (
          <IfElseButton
            type="Comment"
            action="Issue"
            model={{ project: projectMetadata, comment }}
            ifClick={changeItemIssueStatus}
            elseClick={() => {}}
            element={"div"}
            className="d-inline-block"
          >
            <span
              key={`comment-${comment.id}__tag-issue--open`}
              className="badge badge-danger issue"
            >
              open
              <VisibleIf
                action="Issue"
                model={{ project: projectMetadata, comment }}
              >
                <i className="fas fa-times" />
              </VisibleIf>
            </span>
          </IfElseButton>
        ) : (
          <span
            onClick={changeItemIssueStatus}
            key={`comment-${comment.id}__tag-issue--close`}
            className="badge badge-light"
          >
            resolved
          </span>
        ))}
    </PunditTypeSet>
  </PunditContainer>
);

const mapState = (state, ownProps) => ({
  ...ownProps,
  user: state.data.user,
  projectMetadata: state.scenes.project.data.metadata
});

export default connect(mapState, {})(ActionableIssueTag);
