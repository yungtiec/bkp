import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../history";
import { ProjectAuthorName } from "../../../components";
import { DocumentToolbar } from './index';

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
      upvoteDocument,
      downvoteDocument,
      showEditor,
      isLoggedIn,
      displayEditor,
      userId,
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
        <ProjectAuthorName name={creator.displayName} userHandle={creator.user_handle} createdAt={createdAt} />
        <DocumentToolbar
          documentMetadata={documentMetadata}
          upvoteDocument={upvoteDocument}
          downvoteDocument={downvoteDocument}
          showEditor={showEditor}
          isLoggedIn={isLoggedIn}
          displayEditor={displayEditor}
          userId={userId}
        />
        <img className="project-document__header-image" src={`${documentMetadata.header_img_url}&auto=format&fit=crop&w=800&q=80`}/>
      </div>
    );
  }
}

// <p className="document__subtitle  mb-4">
//   {`version ${
//     versionMetadata.version_number
//   } created by ${creator} ${collaborators}`}
// </p>
