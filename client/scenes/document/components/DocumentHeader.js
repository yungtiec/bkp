import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../history";
import { ProjectAuthorName } from "../../../components";

export default class DocumentHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    history.push("/project/" + this.props.documentMetadata.project.symbol);
  }

  render() {
    const {
      documentMetadata,
    } = this.props;
    const { creator, createdAt } = documentMetadata;
    const collaborators = documentMetadata.collaborators
      .map((c, i) => {
        if (
          i === documentMetadata.collaborators.length - 1 &&
          documentMetadata.collaborators.length > 1
        )
          return ` and ${c.displayName}`;
        else if (i === 0) return `with ${c.displayName}`;
        else return `, ${c.displayName}`;
      })
      .join("");

    return (
      <div className="project-document__header">
        <p className="document__title">{`${documentMetadata.title}`}</p>
        <ProjectAuthorName name={creator.displayName} createdAt={createdAt} />
      </div>
    );
  }
}

// <p className="document__subtitle  mb-4">
//   {`version ${
//     versionMetadata.version_number
//   } created by ${creator} ${collaborators}`}
// </p>
