import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import axios from "axios";
import { debounce, assignIn } from "lodash";
import CKEditor from "./CKEditor";
import "./DocumentEditor.scss";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import annotator from "annotator";
import { draw, undraw } from "../../annotator/highlight";
import { isEmpty, uniq, cloneDeep } from "lodash";
import { withRouter } from "react-router-dom";
import { DocumentCategorySelect } from "../index";
import ActiveToggle from "../../scenes/document/scenes/Document/components/ActiveToggle";
import CategorySelect from "../../scenes/document/scenes/Document/components/CategorySelect";
import HeaderImageSelector from "../../scenes/document/scenes/Document/components/HeaderImageSelector";
import $ from "jquery";
import { loadModal, hideModal } from "../../data/reducer";
import { ScorecardTable, TagField } from "../index";

class DocumentEditor extends Component {
  constructor(props) {
    super(props);
    this.contentHtml = this.props.documentMetadata.content_html;
    this.state = {
      title: this.props.documentMetadata.title,
      indexDescription: this.props.documentMetadata.index_description || "",
      summary: this.props.documentMetadata.description || "",
      content: this.props.documentMetadata.content_html || "",
      status: {
        submitted: this.props.documentMetadata.submitted,
        reviewed: this.props.documentMetadata.reviewed
      },
      category: this.props.documentMetadata.category
        ? {
            label: this.props.documentMetadata.category,
            value: this.props.documentMetadata.category.replace(" ", "-")
          }
        : null,
      selectedTags: this.props.documentMetadata.tags
        ? this.props.documentMetadata.tags.map(t =>
            assignIn({ label: t.display_name, value: t.name }, t)
          )
        : [],
      headerImageUrl: this.props.documentMetadata.header_img_url,
      hasAnnotator: this.props.documentMetadata.has_annotator,
      renderHtml: this.contentHtml && this.contentHtml.length !== 0,
      temporaryHighlight: {}
    };
    autoBind(this);
    this.onChangeSummary = debounce(this.onChangeSummary, 500);
    this.onChangeContent = debounce(this.onChangeContent, 500);
  }

  async componentDidMount() {
    const { isLoggedIn, documentMetadata } = this.props;
    loadAnnotation(this);
    !isLoggedIn || !documentMetadata.has_annotator
      ? hideAnnotatorUI()
      : showAnnotatorUI();
  }

  async componentDidUpdate() {
    const { isLoggedIn, documentMetadata } = this.props;
    !isLoggedIn || !documentMetadata.has_annotator
      ? hideAnnotatorUI()
      : showAnnotatorUI();
    await reloadAnnotations({
      match: this.props.match,
      doc_id: this.props.documentMetadata.id,
      self: this
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

  handleTitleChange(evt) {
    this.setState({
      title: evt.target.value
    });
  }

  handleStatusChange(status) {
    let docStatus;
    if (status.value === 'draft') {
      docStatus = { submitted: false, reviewed: false};
    } else if (status.value === 'published') {
      docStatus = { submitted: true, reviewed: false};
    } else if (status.value === 'featured') {
      docStatus = { submitted: true, reviewed: true};
    }

    console.log({docStatus});

    this.setState({
      status: docStatus
    });
  }

  handleCategoryChange(category) {
    this.setState({
      category: category
    });
  }

  handleHasAnnotatorChange(evt) {
    this.setState({
      hasAnnotator: evt.target.checked
    });
  }

  handleImageSelection(image) {
    this.setState(
      {
        headerImageUrl: image
      },
      () => {
        this.props.hideModal();
      }
    );
  }

  openImageFinderModal() {
    this.props.loadModal("IMAGE_FINDER_MODAL", {
      handleImageSelection: this.handleImageSelection,
      hideModal: this.props.hideModal
    });
  }

  onChangeIndexDescription(evt) {
    // const newSummary = this.ckeditorSummary.editorInstance.getData()
    var newIndexDescription = evt.editor.getData();
    this.setState({
      indexDescription: newIndexDescription
    });
  }

  onChangeSummary(evt) {
    // const newSummary = this.ckeditorSummary.editorInstance.getData()
    var newSummary = evt.editor.getData();
    this.setState({
      summary: newSummary
    });
  }

  onChangeContent(evt) {
    // const newContent = this.ckeditorContent.editorInstance.getData()
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  }

  async onButtonPress() {
    const { documentMetadata, updateContentHTMLBySlug, hideEditor, closeSidebar } = this.props;
    const { summary, content, status, category, headerImageUrl, indexDescription, hasAnnotator } = this.state;
    const hasNewTitle = this.props.documentMetadata.title !== this.state.title;
    const newTitle = hasNewTitle ? this.state.title : null;

    const propertiesToUpdate = {
      indexDescription,
      summary,
      content,
      status,
      category,
      headerImageUrl,
      newTitle,
      hasAnnotator,
      tags: this.state.selectedTags || []
    };
    closeSidebar();
    await updateContentHTMLBySlug(documentMetadata.slug, propertiesToUpdate, hideEditor);
    this.setState(
      {
        renderHtml: !this.state.renderHtml
      }
    );
  }

  onTagSelect(selected) {
    selected = selected[0].name
      ? selected[0]
      : { ...selected[0], name: selected[0].value };
    if (
      this.state.selectedTags.map(tag => tag.name).indexOf(selected.value) ===
      -1
    ) {
      this.setState(prevState => ({
        selectedTags: [...prevState.selectedTags, selected]
      }));
    }
  }

  onRemoveTag(index) {
    this.setState({
      selectedTags: this.state.selectedTags.filter((tag, i) => i !== index)
    });
  }

  render() {
    const scriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;
    const { indexDescription, summary, content, headerImageUrl } = this.state;
    const { documentMetadata, displayEditor, user } = this.props;
    console.log('tags', this.state.tags);
    return (
      <div>
        {displayEditor ? (
          <div className="mb-4">
            <div className="mb-4">
              <div className="mb-4">
                Title:
                <div>
                  <input
                    name="title"
                    class="Select-control"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                Status:
                <ActiveToggle
                  handleStatusChange={this.handleStatusChange}
                  status={this.state.status}
                  user={user}
                />
              </div>
              {/*<div className="mb-4">*/}
                {/*Category:*/}
                {/*<DocumentCategorySelect*/}
                  {/*handleCategoryChange={this.handleCategoryChange}*/}
                  {/*category={this.state.category}*/}
                {/*/>*/}
              {/*</div>*/}
              <div className="mb-4">
                Tags: <span style={{color: 'gray'}}>(max 3)</span>
                <TagField
                  handleOnSelect={this.onTagSelect}
                  handleRemoveTag={this.onRemoveTag}
                  selectedTags={this.state.selectedTags}
                  disabled={this.state.selectedTags.length === 3}
                  width="300px"
                />
              </div>
              <div className="mb-4">
                Annotator:
                <div>
                  <input
                    name="hasAnnotator"
                    type="checkbox"
                    checked={this.state.hasAnnotator}
                    onChange={this.handleHasAnnotatorChange}
                  />
                </div>
              </div>
              <div className="mt-2 mb-4">
                Header Image To Display On Feed:
                <HeaderImageSelector
                  openImageFinderModal={this.openImageFinderModal}
                  headerImageUrl={headerImageUrl}
                />
              </div>
            </div>
            <div className="mb-4">
              <span className="mb-2">Index Description:</span>
              <CKEditor
                name="document-summary"
                activeClass="p10"
                content={indexDescription}
                scriptUrl={scriptUrl}
                events={{
                  change: this.onChangeIndexDescription
                }}
                config={{ id: "cke-document-index-description" }}
              />
            </div>
            <div className="mb-4">
              <span className="mb-2">Summary:</span>
              <CKEditor
                name="document-summary"
                activeClass="p10"
                content={summary}
                scriptUrl={scriptUrl}
                events={{
                  change: this.onChangeSummary
                }}
                config={{ id: "cke-document-summary" }}
              />
            </div>
            <div className="mb-4">
              <span className="mb-2">Content:</span>
              <CKEditor
                name="document-content"
                activeClass="p10"
                content={content}
                scriptUrl={scriptUrl}
                events={{
                  change: this.onChangeContent
                }}
                config={{ id: "cke-document-content" }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            {summary ? (
              <div className="document-summary mb-3">
                <div className="markdown-body">{ReactHtmlParser(summary)}</div>
              </div>
            ) : null}
            <div className="document-content" ref={el => (this[`content`] = el)}>
              <div
                className="markdown-body"
                onClick={this.handleAnnotationInContentOnClick}
              >
                {documentMetadata.document_type === "legacy_scorecard" ? (
                  <ScorecardTable scorecard={documentMetadata.scorecard} />
                ) : null}
                {ReactHtmlParser(content)}
              </div>
            </div>
          </div>
        )}
        {displayEditor && this.props.isLoggedIn ? (
          <button className="edit-button" onClick={this.onButtonPress}>
            save
          </button>
        ) : null}
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return { ...ownProps };
};

const actions = {
  loadModal,
  hideModal
};

export default connect(
  mapState,
  actions
)(withRouter(DocumentEditor));

async function loadAnnotation(self) {
  if (!self.annotator) {
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
      minChars: 3,
      autocomplete_url: "/api/tags/autocomplete",
      defaultText: "add tag(s)",
      height: "70px",
      width: "100%",
      interactive: true,
      delimiter: [";"]
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

async function reloadAnnotations({ self, doc_id, match }) {
  self.annotator &&
    self.annotator.annotations.load({
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
  return uniq(annotationIds).filter(id => !isNaN(id));
}
