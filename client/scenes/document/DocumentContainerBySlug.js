import "./DocumentContainer.scss";
import "./annotator.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  withRouter,
  route,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { maxBy } from "lodash";
import PropTypes from "prop-types";
import { Events, scrollSpy, animateScroll as scroll } from "react-scroll";
import QueryDocumentBySlug from "./scenes/Document/QueryDocumentBySlug";
import autoBind from "react-autobind";
import { DocumentHeader, DocumentToolbar } from "./components";
import { VersionIssues, VersionProgress } from "./scenes/Document/components";
import history from "../../history";
import { TagChip } from "../../components";
import { hideEditor, showEditor } from "./data/ckEditor/actions";
import { Helmet } from "react-helmet";

class DocumentContainer extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.url !== this.props.match.url) {
      scroll.scrollToTop();
    }
  }

  componentWillUnmount() {
    Events.scrollEvent.remove("begin");
    Events.scrollEvent.remove("end");
  }

  render() {
    const {
      documentMetadata,
      isClosedForComment,
      upvoteDocument,
      downvoteDocument,
      match,
      showEditor,
      hideEditor,
      isLoggedIn,
      displayEditor,
      userId,
      sidebarOpen,
      toggleSidebar,
      sidebarContext,
      toggleSidebarContext
    } = this.props;

    var wrapper = document.createElement("div");
    wrapper.innerHTML = documentMetadata.index_description || documentMetadata.description;
    const currentImage = documentMetadata.header_img_url;
    const imgUrl = currentImage.includes("unsplash") ?
      currentImage.concat('&auto=format&fit=crop&w=600&q=60') :
      currentImage;

    console.log({imgUrl});

    return (
      <div
        className={`document-container ${
          sidebarOpen ? "document-container--sidebar-open" : ""
        }`}
      >
        <Helmet>
          <title>{documentMetadata.title}</title>
          <meta
            name="description"
            itemProp="description"
            content={wrapper.textContent}
          />
          <meta property="fb:app_id" content="312700812765621" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={documentMetadata.title} />
          <meta
            property="og:url"
            content={`https://thebkp.com/s/${documentMetadata.slug}`}
          />
          <meta
            property="og:image"
            content={`${
              imgUrl
            }`}
          />
          <meta property="og:description" content={wrapper.textContent} />
          <meta
            name="twitter:url"
            content={`https://thebkp.com/s/${documentMetadata.slug}`}
          />
          <meta name="twitter:title" content={documentMetadata.title} />
          <meta name="twitter:description" content={wrapper.textContent} />
          <meta
            name="twitter:image"
            content={`${
              imgUrl
            }`}
          />
          <meta name="twitter:card" content="summary" />
        </Helmet>
        <DocumentHeader
          documentMetadata={documentMetadata}
          isClosedForComment={isClosedForComment}
          upvoteDocument={upvoteDocument}
          downvoteDocument={downvoteDocument}
          showEditor={showEditor}
          isLoggedIn={isLoggedIn}
          displayEditor={displayEditor}
          userId={userId}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          toggleSidebarContext={toggleSidebarContext}
          sidebarContext={sidebarContext}
        />
        {documentMetadata.tags && documentMetadata.tags.length ? (
          <div className="mt-3 document_tags-container" style={{ lineHeight: 1.5 }}>
            {documentMetadata.tags.map((tag, index) => (
              <TagChip
                key={`tag__${tag.name}`}
                containerClassname="tag-field__tag dark-bg"
                tagValue={tag.name}
              />
            ))}
          </div>
        ) : (
          ""
        )}
        <Switch>
          <Route
            path={`${match.path}`}
            render={props => (
              <QueryDocumentBySlug
                displayEditor={displayEditor}
                documentMetadata={documentMetadata}
                hideEditor={hideEditor}
                {...this.props}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(DocumentContainer);
