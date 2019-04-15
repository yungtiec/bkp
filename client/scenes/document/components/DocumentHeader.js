import "./DocumentHeader.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import history from "../../../history";
import { DocumentToolbar } from './index';
import { Link } from "react-router-dom";
import moment from "moment";

const DocumentAuthorName = ({ name, userHandle, delegate, createdAt }) => (
  <p className="document-author__header">
    By{" "}
    <Link to={`/profile/@${userHandle}`}>
      {name}
      {delegate ? " (Reposted By BKP Admin)" : ""} |
    </Link>
    <span className="document-published-date__header">
      Published {moment(createdAt).format("MM.DD.YYYY")}
    </span>
  </p>
);

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
      upvoteDocument,
      downvoteDocument,
      showEditor,
      isLoggedIn,
      displayEditor,
      userId,
      toggleSidebar
    } = this.props;
    const { documentMetadata } = this.props;
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
    const imgUrl = documentMetadata.header_img_url;
    const formattedUrl = imgUrl && imgUrl.includes("unsplash")
        ? imgUrl.concat("&auto=format&fit=crop&w=800&q=10")
        : imgUrl;
    return (
      <div className="project-document__header">
        <div className="project-document__header-text">
          <p className="document__title">{`${documentMetadata.title}`}</p>
          <DocumentAuthorName
            name={creator.displayName}
            userHandle={creator.user_handle}
            delegate={creator.delegate}
            createdAt={createdAt}
          />
          <DocumentToolbar
            documentMetadata={documentMetadata}
            upvoteDocument={upvoteDocument}
            downvoteDocument={downvoteDocument}
            showEditor={showEditor}
            isLoggedIn={isLoggedIn}
            displayEditor={displayEditor}
            userId={userId}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="project-document__header-image" style={{
          backgroundImage: `url(${formattedUrl})`
        }}/>
      </div>
    );
  }
}
