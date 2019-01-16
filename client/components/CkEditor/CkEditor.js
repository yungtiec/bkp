import React, { Component } from "react";
import autoBind from "react-autobind";
import CKEditor from "react-ckeditor-component";
import "./CkEditor.scss";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import annotator from "annotator";
import { draw, undraw } from "../../annotator/highlight";
import { isEmpty, uniq, cloneDeep } from "lodash";
import { withRouter } from "react-router-dom";
import ActiveToggle from "../../scenes/document/scenes/Document/components/ActiveToggle";
import CategorySelect from "../../scenes/document/scenes/Document/components/CategorySelect";
import $ from "jquery";

class CkEditor extends Component {
  constructor(props) {
    super(props);
    this.contentHtml = this.props.documentMetadata.content_html;
    this.state = {
      content: this.props.documentMetadata.content_html || "",
      status: this.props.documentMetadata.reviewed,
      category: this.props.documentMetadata.category,
      renderHtml: this.contentHtml && this.contentHtml.length !== 0,
      temporaryHighlight: {}
    };
    autoBind(this);
  }

  async componentDidMount() {
    loadAnnotation(this);
    !this.props.isLoggedIn || this.props.isClosedForComment
      ? hideAnnotatorUI()
      : showAnnotatorUI();
  }

  async componentDidUpdate() {
    !this.props.isLoggedIn || this.props.isClosedForComment
      ? hideAnnotatorUI()
      : showAnnotatorUI();
    await reloadAnnotations({
      match: this.props.match,
      doc_id: this.props.documentMetadata.id,
      annotator: this.annotator
    });
  }

  handleAnnotationInContentOnClick() {
    const selection = window.getSelection
      ? window.getSelection()
      : document.selection.createRange().text;
    const isSelectionNotClick = selection.toString().length;
    if (isSelectionNotClick) return;
    const annotationIds = getAnnotationIdsOfDomSelection(selection);
    if (annotationIds && annotationIds.length) {
      this.props.updateSidebarCommentContext({
        selectedCommentIds: annotationIds,
        focusOnce: true
      });
    }
  }

  updateContent(newContent) {
    this.setState({
      content: newContent
    });
  }

  handleStatusChange(status) {
    this.setState({
      status: status.value
    });
  }

  handleCategoryChange(category) {
    this.setState({
      category: category.value
    });
  }

  onChange(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  }

  async onButtonPress() {
    const { documentMetadata, updateContentHTMLBySlug } = this.props;
    const { content, status, category } = this.state;

    const propertiesToUpdate = {
      content,
      status,
      category
    };

    console.log(propertiesToUpdate);

    await updateContentHTMLBySlug(documentMetadata.slug, propertiesToUpdate);
    this.setState({
      renderHtml: !this.state.renderHtml
    });
  }

  render() {
    const scriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;
    const { renderHtml, content } = this.state;
    const { documentMetadata } = this.props;
    return (
      <div>
        {!renderHtml ? (
          <div className="mb-4">
            <div className="mb-4">
              <ActiveToggle
                handleStatusChange={this.handleStatusChange}
                status={this.state.status}
              />
              <CategorySelect
                handleCategoryChange={this.handleCategoryChange}
                category={this.state.category}
              />
            </div>
            <CKEditor
              activeClass="p10"
              content={content}
              scriptUrl={scriptUrl}
              events={{
                change: this.onChange
              }}
            />
          </div>
        ) : (
          <div className="mb-4" ref={el => (this[`content`] = el)}>
            <div
              className="html-content-body"
              onClick={this.handleAnnotationInContentOnClick}
            >
              {ReactHtmlParser(content)}
            </div>
          </div>
        )}
        {!renderHtml && this.props.isLoggedIn ? (
          <button className="edit-button" onClick={this.onButtonPress}>
            save
          </button>
        ) : null}

        {renderHtml && this.props.isLoggedIn ? (
          <button className="edit-button" onClick={this.onButtonPress}>
            edit
          </button>
        ) : null}
      </div>
    );
  }
}

export default withRouter(CkEditor);

async function loadAnnotation(self) {
  if (!self.annotation) {
    const { qna, match, isLoggedIn, tagFilter, documentMetadata } = self.props;
    var app = new annotator.App();
    var pageUri = function() {
      return {
        beforeAnnotationCreated: function(ann) {
          var temporaryHighlight = draw(self["content"], ann);
          self.setState({
            temporaryHighlight
          });
          ann.uri = `${window.location.origin}`;
        },
        annotationCreated: function(ann) {
          undraw(self.state.temporaryHighlight);
          self.props.addNewCommentSentFromServer(ann);
        }
      };
    };
    app
      .include(annotator.ui.main, {
        element: self[`content`],
        editorExtensions: [
          annotator.ui.issue.editorExtension,
          annotator.ui.tags.editorExtension.bind(null, {
            class: "annotator__tag-container"
          })
        ]
      })
      .include(annotator.storage.http, {
        prefix: `${window.location.origin}/api/documents/${
          documentMetadata.id
        }/annotator`,
        urls: {
          create: "/",
          update: "/update/:id",
          destroy: "/delete/:id",
          search: "/"
        }
      })
      .include(pageUri);
    const doc_id = documentMetadata.id;
    await app.start().then(function() {
      app.annotations.load({
        uri: `${window.location.origin}${match.url}`,
        doc_id: doc_id
      });
    });
    self.annotator = app;
    $(".annotator__tag-container").tagsInput({
      autocomplete_url: "/api/tags/autocomplete",
      defaultText: "add tag(s)",
      height: "70px",
      width: "100%",
      interactive: true,
      delimiter: [" "]
    });
    $(".annotator-cancel").click(evt => {
      if (!isEmpty(self.state.temporaryHighlight))
        undraw(self.state.temporaryHighlight);
    });
  }
}

function hideAnnotatorUI() {
  $(".annotator-adder").css("display", "none");
  $(".annotator-adder").css("opacity", 0);
  $(".annotator-adder button").css("cursor", "text");
  $(".annotator-adder").css("height", "0px");
}

function showAnnotatorUI() {
  $(".annotator-adder").css("display", "block");
  $(".annotator-adder").css("opacity", 1);
  $(".annotator-adder").css("cursor", "pointer");
  $(".annotator-adder").css("height", "inherit");
}

async function reloadAnnotations({ annotator, doc_id, match }) {
  annotator.annotations.load({
    uri: `${window.location.origin}${match.url}`,
    doc_id
  });
}

function getAnnotationIdsOfDomSelection(selection) {
  var annotationIds = [];
  var $node = $(selection.anchorNode);
  if ($node.get(0).nodeType === 3) $node = $node.parent();
  while (
    $node.attr("class") &&
    $node.attr("class").indexOf("annotator-hl") !== -1
  ) {
    annotationIds.push(Number($node.attr("data-annotation-id")));
    $node = $node.parent();
  }
  return uniq(annotationIds);
}
