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
import {hideEditor, showEditor} from './data/ckEditor/actions';

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
    if (
      prevProps.match.url !== this.props.match.url
    ) {
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
      userId
    } = this.props;

    return (
      <div className="main-container document-container">
        <DocumentHeader
          documentMetadata={documentMetadata}
          isClosedForComment={isClosedForComment}
          upvoteDocument={upvoteDocument}
          downvoteDocument={downvoteDocument}
          showEditor={showEditor}
          isLoggedIn={isLoggedIn}
          displayEditor={displayEditor}
          userId={userId}
        />
        <Switch>
          <Route
            path={`${match.path}`}
            render={props =>
              <QueryDocumentBySlug
                displayEditor={displayEditor}
                documentMetadata={documentMetadata}
                hideEditor={hideEditor}
              />}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(DocumentContainer);
