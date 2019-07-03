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
import history from "./../../history";
import {hideModal, loadModal} from '../../data/reducer';
import * as types from './data/upload/actionTypes';
import {Helmet} from 'react-helmet';

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
    this.props.updateSummary(newContent);
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
    if (key > 1)
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title
      }));
    if (key > 3)
      this.setState(prevState => ({
        ...prevState,
        headerImageUrlError: !this.props.headerImageUrl
      }));
    if (key > 4)
      this.setState(prevState => ({
        ...prevState,
        indexDescriptionError: !this.props.indexDescription
      }));
    if (key > 5)
      this.setState(prevState => ({
        ...prevState,
        contentHtmlError: !this.props.contentHtml
      }));
    this.setState({
      activeAccordionItemId: key
    });
  }

  next(currentField) {
    if (currentField === "title" && !this.props.title){
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title
      }));
    }
    else if (currentField === "title" && this.props.title && this.state.titleError) {
      this.setState(prevState => ({
        ...prevState,
        titleError: !this.props.title,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    }
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
    else {
      this.setState(prevState => ({
        ...prevState,
        activeAccordionItemId: prevState.activeAccordionItemId + 1
      }));
    }
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
      this.props.loadModal("CONFIRMATION_MODAL", {
        title: "Submit Article",
        message:
          "Once an article is submitted, an editor will review it before publishing. Would you like to submit?",
        errors: this.incompleteForm,
        hideModal: this.props.hideModal,
        submit: {
          label: "Submit",
          handler: async () => {
            const document = await this.props.uploadHtmlToServer();

            this.props.loadModal("CONFIRMATION_MODAL", {
              title: "Thank You For Your Submission",
              message:
                "Your article has been shared with BKP admins. Someone will get in touch with you.",
              hideModal: hideModal,
              submit: {
                label: "Go To Article",
                handler: () => {
                  this.props.hideModal();
                  history.push(`/s/${document.slug}`);
                  dispatch({
                    type: types.MARKDOWN_UPLOADED
                  });
                  return document;
                }
              }
            });

          }
        },
        cancel: {
          label: "No",
          handler: this.props.hideModal
        }
      });

    } else {
      this.setState({ uploadClicked: true });
    }
  }

  render() {
    const {
            width,
            sidebarOpen,
            toggleSidebar,
            headerImageUrl,
          } = this.props;
    const scriptUrl = `${window.location.origin.toString()}/assets/ckeditor/ckeditor.js`;

    return (
      <div className="main-container">
        <Helmet>
          <title>Submit Article</title>
          <meta
            name="description"
            itemProp="description"
            content={`Thank you for your interest in submitting an article to the Brooklyn Project. We aspire to be the home for open collaboration on blockchain law, regulation, and policy.`}
          />
          <meta property="fb:app_id" content="312700812765621" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`Submit Article`} />
          <meta
            property="og:url"
            content={`https://thebkp.com/submit`}
          />
          <meta property="og:description" content={`Thank you for your interest in submitting an article to the Brooklyn Project. We aspire to be the home for open collaboration on blockchain law, regulation, and policy.`} />
          <meta
            name="twitter:url"
            content={`https://thebkp.com/submit`}
          />
          <meta name="twitter:title" content={`Submit Article`} />
          <meta name="twitter:description" content={`Thank you for your interest in submitting an article to the Brooklyn Project. We aspire to be the home for open collaboration on blockchain law, regulation, and policy.`} />
          <meta name="twitter:card" content="summary" />
        </Helmet>
        <div
          style={{
            maxWidth: "740px",
            padding: "20px 0px 6rem"
          }}
        >
          <Accordion onChange={this.handleAccordionChange}>
            <AccordionItem expanded={this.state.activeAccordionItemId === 0}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">Submission Guidelines</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <h5>Submitting an article to The Brooklyn Project</h5>
                  <div>
                    <p>Thank you for your interest in submitting an article to the Brooklyn Project. We aspire to be the home for open collaboration on blockchain law, regulation, and policy.</p>
                    <p>The submission process for articles is simple:
                      <ol>
                        <li>Follow the next steps in the upload interface. When you’re ready, click submit.</li>
                        <li>Someone at The Brooklyn Project will review your submission and get back to you.</li>
                      </ol>
                    </p>
                    <p>Accepted articles will appear on the landing page of <a href="www,thebkp.com">theBKP.com</a>.</p>
                    <p>While we aspire to make this as open an initiative as possible, we have created a set of guidelines to ensure the content on our site is relevant to our community. We reserve the right to decline the publication of any article for whatever reason.</p>
                    <p><strong>On-topic</strong>: anything related to blockchain law, regulation and policy. This includes more topics than laws and regulations.</p>
                    <p><strong>Off-topic</strong>: links to events (except those relevant to members of our community), ad-hominem attacks, an pitch, trading strategies, promotions, and pictures of cats. If it’s blocked on our Telegram Channel, it will probably also be blocked on <a href="www,thebkp.com">theBKP.com</a>.</p>
                    <p>By submitting an article, you agree with our terms of use and privacy policy. If you have any questions, send us an email at info@thebkp.com.</p>
                    <p><strong><a href="https://drive.google.com/file/d/1p4F4UVhCohifqb0R5WzfJ8R1nKJOahIV/view" style={{color:'blue'}} target="_blank" >Terms of Use</a></strong></p>
                    <p><strong><a href="https://drive.google.com/file/d/1n_O-nF74sDkONplSrmcpZczAov30cMug/view" style={{color:'blue'}} target="_blank" >Privacy Policy</a></strong></p>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 1}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">title</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>article title</p>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 2}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">Tags</p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex flex-column">
                  <p>select tag(s) for your article (max 3)</p>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 3}>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 4}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Summary
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>This will appear at the top of your article.</p>
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
            <AccordionItem expanded={this.state.activeAccordionItemId === 5}>
              <AccordionItemTitle>
                <p className="upload-accordion__item-header">
                  Article Content
                </p>
              </AccordionItemTitle>
              <AccordionItemBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p style={{ marginBottom: "0px" }}>Provide article content:</p>
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
                  title="submission guidelines"
                  description="read our submission guidelines"
                />
                <Step
                  title="title"
                  description="set article title"
                  status={
                    this.state.titleError
                      ? "error"
                      : this.state.activeAccordionItemId > 1
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="tags"
                  description="select tag(s) for your article"
                />
                <Step
                  title="header image"
                  description="set article header image"
                  status={
                    this.state.headerImageUrlError
                      ? "error"
                      : this.state.activeAccordionItemId > 3
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="summary"
                  description="create article summary"
                  status={
                    this.state.indexDescriptionError
                      ? "error"
                      : this.state.activeAccordionItemId > 4
                      ? "finish"
                      : "wait"
                  }
                />
                <Step
                  title="content"
                  description="create article content"
                  status={
                    this.state.contentHtmlError
                      ? "error"
                      : this.state.activeAccordionItemId === 5 &&
                      this.props.contentHtml
                      ? "finish"
                      : "wait"
                  }
                />
              </Steps>
              {/*<div className="mb-5 mt-2">*/}
                {/*<button*/}
                  {/*type="button"*/}
                  {/*class="btn btn-primary btn-lg btn-block "*/}
                  {/*onClick={this.submit}*/}
                {/*>*/}
                  {/*Submit*/}
                {/*</button>*/}
                {/*{this.state.uploadClicked &&*/}
                {/*!(*/}
                  {/*(this.state.isScorecard &&*/}
                    {/*!!this.props.selectedProject &&*/}
                    {/*this.props.scorecardCompleted) ||*/}
                  {/*(!this.state.isScorecard &&*/}
                    {/*!this.state.categoryError &&*/}
                    {/*!this.state.titleError &&*/}
                    {/*!this.state.headerImageUrlError &&*/}
                    {/*!this.state.contentHtmlError &&*/}
                    {/*!this.state.summaryError)*/}
                {/*) ? (*/}
                  {/*<p className="text-danger">*/}
                    {/*Please go through all the mandatory fields*/}
                  {/*</p>*/}
                {/*) : null}*/}
              {/*</div>*/}
            </div>
          </CustomScrollbar>
        </SidebarLayout>
      </div>
    );
  }
}

export default Upload;
