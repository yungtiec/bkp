import "./Upload.scss";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import {
  SidebarLayout,
  CustomScrollbar,
  requiresAuthorization,
  ProjectScorecardInputs,
  DocumentCategorySelect,
  CKEditor,
  TagField
} from "../../components";
import UploadInterface from "./components/UploadInterface";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  resetNextUuid
} from "react-accessible-accordion";
import Steps, { Step } from "rc-steps";
import Formsy from "formsy-react";
import HeaderImageSelector from "../document/scenes/Document/components/HeaderImageSelector";
import history from '../../history';

class Upload extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      activeAccordionItemId: 0,
      versionNumberError: false,
      projectError: false,
      categoryError: false,
      scorecardError: false,
      titleError: false,
      headerImageUrlError: false,
      contentHtmlError: false,
      summaryError: false,
      indexDescriptionError: false,
      isScorecard: false,
      uploadClicked: false,
      headerImageUrl: ""
    };
  }
  componentDidMount() {
    this.setState({
      activeAccordionItemId: 0,
      versionNumberError: false,
      projectError: false,
      categoryError: false,
      scorecardError: false,
      titleError: false,
      headerImageUrlError: false,
      contentHtmlError: false,
      summaryError: false,
      indexDescriptionError: false,
      isScorecard: false,
      uploadClicked: false,
      headerImageUrl: ""
    });
    this.props.resetSubmitForm();
    resetNextUuid();
  }

  handleCommentPeriodUnitChange(selected) {
    this.props.updateCommentPeriodUnit(selected.value);
  }

  handleCommentPeriodValueChange(evt) {
    this.props.updateCommentPeriodValue(evt.target.value);
  }

  handleVersionNumberChange(evt) {
    this.props.updateVersionNumber(evt.target.value);
    if (evt.target.value.trim())
      this.setState(prevState => ({
        ...prevState,
        versionNumberError: false
      }));
  }

  handleProjectSelectChange(selected) {
    this.props.updateSelectedProject(
      this.props.projectsBySymbol[selected.value]
    );
    this.setState(prevState => ({
      ...prevState,
      projectError: false
    }));
  }

  handleCollaboratorChange(selected) {
    this.props.updateCollaborators(selected);
  }

  handleIsScorecardChange(evt) {
    this.setState({
      isScorecard: evt.target.checked
    });
  }

  handleHasAnnotator(evt) {
    this.props.updateHasAnnotator(evt.target.checked)
  }

  handleTitleChange(evt) {
    const title = evt.target.value;
    this.props.updateTitle(title);
  }

  handleContentCkEditorChange(evt) {
    var newContent = evt.editor.getData();
    this.props.updateContentHtml(newContent);
  }

  handleSummaryCkEditorChange(evt) {
    var newContent = evt.editor.getData();
    this.props.updateSummary(newContent);
  }

  handleIndexDescriptionCkEditorChange(evt) {
    var newContent = evt.editor.getData();
    this.props.updateIndexDescription(newContent);
  }

  handleImageSelection(headerImageUrl) {
    this.props.updateHeaderImageUrl(headerImageUrl);
    this.props.hideModal();
  }

  openImageFinderModal() {
    this.props.loadModal("IMAGE_FINDER_MODAL", {
      handleImageSelection: this.handleImageSelection,
      hideModal: this.props.hideModal
    });
  }

  handleCategoryChange(category) {
    this.props.updateCategory(category);
    this.setState({
      categoryError: false
    });
  }

  handleTagSelect(selected) {
    selected = selected[0].name
      ? selected[0]
      : { ...selected[0], name: selected[0].value };
    if (this.props.tags.map(tag => tag.name).indexOf(selected.value) === -1) {
      this.props.updateTags([...this.props.tags, selected]);
    }
  }

  handleRemoveTag(index) {
    this.props.updateTags(this.props.tags.filter((tag, i) => i !== index));
  }

  handleAccordionChange(key) {
    console.log('props', this.props);
    if (key > 0)
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title
      }));
    if (key > 3)
      this.setState(prevState => ({
        ...prevState,
        scorecardError:
          this.state.isScorecard && !this.props.scorecardCompleted,
        projectError: this.state.isScorecard && !this.props.selectedProject
      }));
    if (key > 5)
      this.setState(prevState => ({
        ...prevState,
        headerImageUrlError: !this.props.headerImageUrl
      }));
    if (key > 6)
      this.setState(prevState => ({
        ...prevState,
        indexDescriptionError: !this.props.indexDescription
      }));
    if (key > 7)
      this.setState(prevState => ({
        ...prevState,
        summaryError: !this.props.summary
      }));
    if (key > 8)
      this.setState(prevState => ({
        ...prevState,
        contentHtmlError: !this.props.contentHtml
      }));
    this.setState({
      activeAccordionItemId: key
    });
  }

  next(currentField) {
    if (currentField === "title" && !this.props.title)
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title
      }));
    else if (currentField === "title" && this.props.title && this.state.titleError)
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    else if (
      currentField === "scorecard" &&
      this.state.isScorecard &&
      (!this.props.scorecardCompleted || !this.props.selectedProject)
    )
      this.setState(prevState => ({
        ...prevState,
        scorecardError: !this.props.scorecardCompleted,
        projectError: !this.props.selectedProject
      }));
    else if (currentField === "headerImageUrl" && !this.props.headerImageUrl)
      this.setState(prevState => ({
        ...prevState,
        headerImageUrlError: !this.props.headerImageUrl
      }));
    else if (currentField === "headerImageUrl" && this.props.headerImageUrl && this.state.headerImageUrlError)
      this.setState(prevState => ({
        ...prevState,
        headerImageUrlError: !this.props.headerImageUrl,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    else if (currentField === "indexDescription" && !this.props.indexDescription)
      this.setState(prevState => ({
        ...prevState,
        indexDescriptionError: !this.props.indexDescription,
      }));
    else if (currentField === "indexDescription" && this.props.indexDescription && this.state.indexDescriptionError)
      this.setState(prevState => ({
        ...prevState,
        indexDescriptionError: !this.props.indexDescription,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    else if (currentField === "contentHtml" && !this.props.contentHtml)
      this.setState(prevState => ({
        ...prevState,
        contentHtmlError: !this.props.contentHtml
      }));
    else if (currentField === "contentHtml" && this.props.contentHtml && this.state.contentHtmlError)
      this.setState(prevState => ({
        ...prevState,
        contentHtmlError: !this.props.contentHtml,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    else if (currentField === "summary" && !this.props.summary)
      this.setState(prevState => ({
        ...prevState,
        summaryError: !this.props.summary
      }));
    else if (currentField === "summary" && this.props.summary && this.state.summaryError)
      this.setState(prevState => ({
        ...prevState,
        summaryError: !this.props.summary,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    else
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
  }

  async submit() {
    if (
      (this.state.isScorecard &&
        !!this.props.selectedProject &&
        this.props.scorecardCompleted) ||
      (!this.state.isScorecard &&
        !this.state.titleError &&
        !this.state.headerImageUrlError &&
        !this.state.contentHtmlError &&
        !this.state.indexDescriptionError &&
        !this.state.summaryError)
    ) {
      const document = await this.props.uploadHtmlToServer();
      this.props.loadModal("CONFIRMATION_MODAL", {
        title: "Thank You For Your Submission",
        message:
          "Your article has been shared with BKP admins. Someone will get in touch with you.",
        hideModal: this.props.hideModal,
        submit: {
          label: "Go To Article",
          handler: () => { history.push(`/s/${document.slug}`) }
        }
      });
    } else {
      this.setState({ uploadClicked: true });
    }
  }

  render() {
    const {
      isLoggedIn,
      currentUser,
      width,
      notify,
      projectsBySymbol,
      projectSymbolArr,
      importedMarkdown,
      versionNumber,
      collaboratorOptions,
      updateCollaborators,
      collaboratorEmails,
      updateCommentPeriodUnit,
      commentPeriodValue,
      commentPeriodUnit,
      selectedProject,
      updateProjectScorecard,
      sidebarOpen,
      toggleSidebar,
      scorecardCompleted,
      contentHtml,
      headerImageUrl,
      category,
      summary,
      indexDescription,
      hasAnnotator,
    } = this.props;
    const scriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;

    return (
      <div className="main-container">
        <div
          style={{
            maxWidth: "740px",
            padding: "20px 0px 6rem"
          }}
        >
          <Accordion onChange={this.handleAccordionChange}>
            <AccordionItem expanded={this.state.activeAccordionItemId === 0}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">title</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>document title</p>
                </div>
                <input
                  type="text"
                  name="name"
                  style={{ "min-width": "100%"}}
                  onChange={this.handleTitleChange}
                />
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("title")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 1}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Collaborators (optional)
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <p>select collaborator(s) to work on your document</p>
                  <Select
                    name="upload__collaborator-select"
                    value={collaboratorEmails}
                    multi={true}
                    onChange={this.handleCollaboratorChange}
                    options={collaboratorOptions.map(c => ({
                      label: c.email,
                      value: c.email
                    }))}
                    placeholder="work with..."
                  />
                  <button
                    onClick={this.next}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 2}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Project score (optional)
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <h6 className="upload-accordion__scorecard-checkbox">
                  <input
                    name="isScorecard"
                    type="checkbox"
                    checked={this.state.isScorecard}
                    onChange={this.handleIsScorecardChange}
                  />
                  Is this document a transparency scorecard?
                </h6>

                {this.state.isScorecard ? (
                  <Fragment>
                    <p className="mt-5">pick from projects you manage</p>
                    <Select
                      name="upload__project-select"
                      value={selectedProject.symbol}
                      onChange={this.handleProjectSelectChange}
                      options={
                        projectSymbolArr
                          ? projectSymbolArr.map(symbol => ({
                              label: projectsBySymbol[
                                symbol
                              ].name.toUpperCase(),
                              value: symbol
                            }))
                          : []
                      }
                      placeholder="select..."
                    />
                    {this.state.projectError ? (
                      <p className="text-danger mt-2">project required</p>
                    ) : null}
                    <div className="d-flex flex-column">
                      <h6 className="mb-3 mt-5">
                        Fill in score 1 to 10 (10-best, 1-worst)
                      </h6>
                      <ProjectScorecardInputs
                        updateProjectScorecard={updateProjectScorecard}
                      />
                    </div>
                  </Fragment>
                ) : null}
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("scorecard")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 3}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Annotator (optional)
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <h6 className="upload-accordion__scorecard-checkbox">
                  <input
                    name="hasAnnotator"
                    type="checkbox"
                    checked={hasAnnotator}
                    onChange={this.handleHasAnnotator}
                  />
                  Does this document require the annotator feature?
                </h6>
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("annotator")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">Tags</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <p>select tag(s) for your document (max 3)</p>
                  <TagField
                    handleOnSelect={this.handleTagSelect}
                    handleRemoveTag={this.handleRemoveTag}
                    selectedTags={this.props.tags}
                    disabled={this.props.tags.length >= 3}
                  />
                  <button
                    onClick={this.next}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 5}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">header image</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <HeaderImageSelector
                  openImageFinderModal={this.openImageFinderModal}
                  headerImageUrl={headerImageUrl}
                />
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("headerImageUrl")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 6}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Index Description
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>This description will appear on the index feed if article is featured</p>
                </div>
                <CKEditor
                  name="document-summary"
                  activeClass="p10"
                  content={this.props.indexDescription}
                  scriptUrl={scriptUrl}
                  events={{
                    change: this.handleIndexDescriptionCkEditorChange
                  }}
                  config={{ id: "cke-document-summary" }}
                />
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("indexDescription")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 7}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Document Summary
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>Summarize your document. This will appear before your article.</p>
                </div>
                <CKEditor
                  name="document-summary"
                  activeClass="p10"
                  content={this.props.summary}
                  scriptUrl={scriptUrl}
                  events={{
                    change: this.handleSummaryCkEditorChange
                  }}
                  config={{ id: "cke-document-summary" }}
                />
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.next("summary")}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    next
                  </button>
                </div>
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem expanded={this.state.activeAccordionItemId === 8}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Document Content
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>Provide document content:</p>
                </div>
                <CKEditor
                  name="document-content"
                  activeClass="p10"
                  content={this.props.contentHtml}
                  scriptUrl={scriptUrl}
                  events={{
                    change: this.handleContentCkEditorChange
                  }}
                  config={{ id: "cke-document-content" }}
                />
                <div className="d-flex flex-column">
                  <button
                    onClick={() => this.submit()}
                    className="btn btn-primary mt-4 align-self-end"
                  >
                    submit
                  </button>
                  {this.state.uploadClicked &&
                  !(
                    (this.state.isScorecard &&
                      !!this.props.selectedProject &&
                      this.props.scorecardCompleted) ||
                    (!this.state.isScorecard &&
                      !this.state.categoryError &&
                      !this.state.titleError &&
                      !this.state.headerImageUrlError &&
                      !this.state.contentHtmlError &&
                      !this.state.summaryError)
                  ) ? (
                    <p className="text-danger">
                      Please go through all the mandatory fields
                    </p>
                  ) : null}
                </div>
              </AccordionItemBody>
            </AccordionItem>
          </Accordion>
        </div>

        <SidebarLayout
          width={width}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          <CustomScrollbar
            scrollbarContainerWidth={
              width < 767 ? "350px" : width > 1300 ? "450px" : "410px"
            }
            scrollbarContainerHeight="calc(100% - 70px)"
            autoHide={true}
            scrollbarThumbColor="rgb(233, 236, 239)"
          >
            <div className="sidebar-contents p-5">
              <Steps
                current={this.state.activeAccordionItemId}
                direction="vertical"
              >
                <Step
                  title="title"
                  description="set document title"
                  status={
                    this.state.titleError
                      ? "error"
                      : this.state.activeAccordionItemId > 0
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="collaborators"
                  description="select collaborator(s) to work on your disclosure"
                />
                <Step
                  title="project score"
                  description="fill in project scorecard"
                  status={
                    this.state.scorecardError || this.state.projectError
                      ? "error"
                      : this.state.activeAccordionItemId > 2
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="annotator"
                  description="does this document require the annotator feature?"
                  status={
                    this.state.scorecardError || this.state.projectError
                      ? "error"
                      : this.state.activeAccordionItemId > 3
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="tags"
                  description="select tag(s) for your document"
                />
                <Step
                  title="header image"
                  description="set document header image"
                  status={
                    this.state.headerImageUrlError
                      ? "error"
                      : this.state.activeAccordionItemId > 5
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="index description"
                  description="create document index description"
                  status={
                    this.state.indexDescriptionError
                      ? "error"
                      : this.state.activeAccordionItemId > 6
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="summary"
                  description="create document summary"
                  status={
                    this.state.summaryError
                      ? "error"
                      : this.state.activeAccordionItemId > 7
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="content"
                  description="create document content"
                  status={
                    this.state.contentHtmlError
                      ? "error"
                      : this.state.activeAccordionItemId === 8 &&
                        this.props.contentHtml
                      ? "finish"
                      : "wait"
                  }
                />
              </Steps>
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default Upload;
