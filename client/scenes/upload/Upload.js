import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Select from "react-select";
import {
  SidebarLayout,
  CustomScrollbar,
  requiresAuthorization,
  ProjectScorecardInputs,
  DocumentCategorySelect
} from "../../components";
import UploadInterface from "./components/UploadInterface";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import Steps, { Step } from "rc-steps";
import Formsy from "formsy-react";
import CKEditor from "react-ckeditor-component";
import HeaderImageSelector from "../document/scenes/Document/components/HeaderImageSelector";

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
      isScorecard: false,
      uploadClicked: false,
      content: this.props.contentHtml,
      headerImageUrl: ""
    };
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

  handleTitleChange(evt) {
    const title = evt.target.value;
    this.props.updateTitle(title);
  }

  handleCkEditorChange(evt) {
    var newContent = evt.editor.getData();
    this.props.updateContentHtml(newContent);
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

  handleAccordionChange(key) {
    if (key > 0)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        categoryError: !this.props.category
      }));
    if (key > 3)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        scorecardError:
          this.state.isScorecard && !this.props.scorecardCompleted,
        projectError: this.state.isScorecard && !this.props.selectedProject
      }));
    if (key > 4)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        titleError: !this.props.title
      }));
    if (key > 5)
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: key,
        headerImageUrlError: !this.props.headerImageUrl
      }));
    if (key === 0 || key === 3 || key === 4 || key === 5)
      this.setState({
        activeAccordionItemId: key
      });
  }

  next(currentField) {
    if (currentField === "category" && !this.props.category)
      this.setState(prevState => ({
        ...prevState,
        categoryError: !this.props.category
      }));
    else if (currentField === "title" && !this.props.title)
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title
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
    else
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: (prevState.activeAccordionItemId + 1) % 7,
        scorecardError:
          this.state.isScorecard && !this.props.scorecardCompleted,
        categoryError: !this.props.category,
        projectError: this.state.isScorecard && !this.props.selectedProject,
        headerImageUrlError: !this.props.headerImageUrl,
        titleError: !this.props.title
      }));
  }

  submit() {
    if (
      !!this.props.selectedProject &&
      ((this.state.isScorecard && this.props.scorecardCompleted) ||
        !this.state.isScorecard)
    ) {
      this.props.uploadHtmlToServer();
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
      headerImageUrl,
      category
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
                <p className="upload-accordion__item-header">Category</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <p>pick a category for your document</p>
                  <DocumentCategorySelect
                    handleCategoryChange={this.handleCategoryChange}
                    category={category}
                  />
                  <button
                    onClick={() => this.next("category")}
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
                <p className="upload-accordion__item-header">Comment period</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column upload-accordion__comment-period-control">
                  <p>set comment period for audiences</p>
                  <div className="d-flex">
                    <input
                      name="comment-period-value"
                      type="number"
                      value={commentPeriodValue}
                      onChange={this.handleCommentPeriodValueChange}
                    />
                    <Select
                      name="comment-period-value"
                      value={commentPeriodUnit}
                      onChange={this.handleCommentPeriodUnitChange}
                      options={[
                        { value: "weeks", label: "week(s)" },
                        { value: "days", label: "day(s)" },
                        { value: "hours", label: "hour(s)" }
                      ]}
                    />
                  </div>
                  <button
                    onClick={this.next}
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
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
                  Document Content
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>create document content</p>
                </div>
                <CKEditor
                  activeClass="p10"
                  content={this.props.contentHtml}
                  scriptUrl={scriptUrl}
                  events={{
                    change: this.handleCkEditorChange
                  }}
                />
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
                  title="category"
                  description="pick a category for your document"
                  status={
                    this.state.categoryError
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
                  title="comment period"
                  description="set comment period for audiences"
                />
                <Step
                  title="project score"
                  description="fill in project scorecard"
                  status={
                    this.state.scorecardError || this.state.projectError
                      ? "error"
                      : this.state.activeAccordionItemId > 3
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="title"
                  description="set document title"
                  status={
                    this.state.titleError
                      ? "error"
                      : this.state.activeAccordionItemId > 4
                      ? "finish"
                      : "wait"
                  }
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
                  title="content"
                  description="create document content"
                  status={
                    !importedMarkdown
                      ? "wait"
                      : this.state.activeAccordionItemId === 6
                      ? "finish"
                      : "wait"
                  }
                />
              </Steps>
              <div className="mb-5 mt-2">
                <button
                  type="button"
                  class="btn btn-primary btn-lg btn-block "
                  onClick={this.submit}
                >
                  Upload
                </button>
                {this.state.uploadClicked &&
                !(
                  (!!this.props.selectedProject &&
                    this.state.isScorecard &&
                    this.props.scorecardCompleted) ||
                  !this.state.isScorecard
                ) ? (
                  <p className="text-danger">
                    Please go through all the mandatory fields
                  </p>
                ) : null}
              </div>
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default requiresAuthorization({
  Component: Upload,
  roleRequired: ["project_editor", "project_admin", "admin"]
});
