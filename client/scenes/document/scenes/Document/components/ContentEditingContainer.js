import "./ContentEditingContainer.scss";
import React, { Component } from "react";
import policies from "../../../../../policies.js";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";

export default ({
  containerId,
  otherClassNames,
  editing,
  handleContainerOnClick,
  handleEditOnClick,
  children,
  user,
  punditType,
  punditAction,
  punditModel
}) => (
  <div
    id={containerId}
    className={`editing-toolbar__hover-target ${otherClassNames}`}
    onClick={handleContainerOnClick}
  >
    {children}
    <PunditContainer policies={policies} user={user}>
      <PunditTypeSet type={punditType}>
        <VisibleIf action={punditAction} model={punditModel}>
          {!editing && (
            <div className="editing-toolbar__hover-targeted">
              <button className="btn btn-secondary" onClick={handleEditOnClick}>
                Edit
              </button>
            </div>
          )}
        </VisibleIf>
      </PunditTypeSet>
    </PunditContainer>
  </div>
);
