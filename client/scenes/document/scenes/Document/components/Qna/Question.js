import React, { Component } from "react";
import ReactDOM from "react-dom";
import autoBind from "react-autobind";
import ReactMarkdown from "react-markdown";
import Markmirror from "react-markmirror";
import moment from "moment";
import { sortBy } from "lodash";
import policies from "../../../../../../policies.js";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import { ContentEditingContainer } from "../index";
import { TextDiff } from "../../../../../../utils";

export default class Question extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.diff = new TextDiff();
    this.state = {
      markdown: this.props.question.markdown,
      diff: this.diff.main(
        this.props.question.markdown,
        this.props.question.markdown
      ),
      editing: false,
      versionQuestionIdBeforeReverting: this.props.question.id,
      versionQuestionBeforeReverting: this.props.question.markdown
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.qnaId !== prevProps.qnaId) {
      var newState = {
        markdown: this.props.question.markdown,
        diff: this.diff.main(
          this.props.question.markdown,
          this.props.question.markdown
        ),
        versionQuestionIdBeforeReverting: this.props.question.id,
        versionQuestionBeforeReverting: this.props.question.markdown
      };
      this.setState(prevState => ({ ...prevState, ...newState }));
      setTimeout(() => {
        this.markMirror && this.markMirror.setupCodemirror();
      }, 200);
    }
  }

  handleEditOnClick() {
    this.setState({
      editing: true
    });
  }

  handleValueChange(markdown) {
    this.setState({
      markdown,
      diff: this.diff.main(this.props.question.markdown, markdown)
    });
  }

  handleSubmit() {
    if (
      this.state.versionQuestionBeforeReverting.trim() !==
      this.state.markdown.trim()
    )
      this.props.editQuestion({
        versionQuestionId: this.props.qnaId,
        markdown: this.state.markdown
      });
    this.setState({
      editing: false,
      diff: this.diff.main(this.state.markdown, this.state.markdown)
    });
  }

  handleCancel() {
    this.setState({
      editing: false,
      diff: this.diff.main(
        this.props.question.markdown,
        this.props.question.markdown
      ),
      markdown: this.props.question.markdown
    });
    if (this.state.versionQuestionIdBeforeReverting !== this.props.question.id)
      this.props.revertToPrevQuestion({
        versionQuestionId: this.state.versionQuestionIdBeforeReverting,
        prevVersionQuestionId: this.props.question.id
      });
  }

  renderToolbar(markmirror, renderButton) {
    const { user, qnaId, question, revertToPrevQuestion } = this.props;

    return (
      <div className="markmirror__toolbar myapp__toolbar">
        {renderButton("h1")}
        {renderButton("h2")}
        {renderButton("h3")}
        {renderButton("bold")}
        {renderButton("italic")}
        {renderButton("oList")}
        {renderButton("uList")}
        {renderButton("quote")}
        {renderButton("link")}
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            previous edits
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {sortBy(question.history, ["hierarchyLevel"], "asc").map(h => (
              <a
                class={`dropdown-item ${h.id === question.id ? "active" : ""}`}
                onClick={() =>
                  revertToPrevQuestion({
                    versionQuestionId: h.id,
                    prevVersionQuestionId: question.id
                  })
                }
              >
                {moment(h.createdAt).format("YYYY/MM/DD, HH:mm")}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <ContentEditingContainer
        containerId={`qna-${this.props.qnaId}__question`}
        otherClassNames=""
        handleContainerOnClick={e => {
          this.props.handleCommentOnClick(e, this.props.qnaId);
        }}
        editing={this.state.editing}
        handleEditOnClick={this.handleEditOnClick}
        user={this.props.user}
        punditType="Disclosure"
        punditAction="Create"
        punditModel={{
          project: this.props.documentMetadata.project,
          disclosure: this.props.documentMetadata
        }}
      >
        {this.state.editing ? (
          <div>
            <Markmirror
              key="question-markmirror"
              defaultValue={this.props.question.markdown}
              value={this.state.markdown}
              onChange={this.handleValueChange}
              renderToolbar={this.renderToolbar}
              ref={el => (this.markMirror = el)}
            />
            <ReactMarkdown
              className="markdown-body markdown-body--text-diff qna__question qna__question--editing mb-2 p-3"
              source={this.diff.getMarkdownWithdifference(this.state.diff)}
            />
            <div className="d-flex justify-content-end my-3">
              <button className="btn btn-primary" onClick={this.handleSubmit}>
                Save
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={this.handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <ReactMarkdown
            className="qna__question"
            source={this.props.question.markdown}
          />
        )}
      </ContentEditingContainer>
    );
  }
}
