import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import autoBind from "react-autobind";
import { find, keyBy, clone } from "lodash";
import Markmirror from "react-markmirror";
import moment from "moment";

export default class Answers extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      markdown: this.props.answer.markdown,
      editing: false,
      versionAnswerIdBeforeReverting: this.props.answer.id
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.answer.id !== prevProps.answer.id) {
      var newState =
        this.props.answer.history.length === prevProps.answer.history.length
          ? { markdown: this.props.answer.markdown }
          : {
              markdown: this.props.answer.markdown,
              versionAnswerIdBeforeReverting: this.props.answer.id
            };
      this.setState(newState);
      setTimeout(
        () => this.markMirror && this.markMirror.setupCodemirror(),
        200
      );
    }
  }

  handleEditingOnClick() {
    this.setState({
      editing: true
    });
  }

  handleValueChange(markdown) {
    this.setState({ markdown });
  }

  handleSubmit() {
    this.props.editAnswer({
      versionAnswerId: this.props.answer.id,
      markdown: this.state.markdown,
      versionQuestionId: this.props.qnaId
    });
  }

  handleCancel() {
    this.setState({
      editing: false
    });
    console.log(
      this.state.versionAnswerIdBeforeReverting,
      this.props.answer.id
    );
    if (this.state.versionAnswerIdBeforeReverting !== this.props.answer.id)
      this.props.revertToPrevAnswer({
        versionQuestionId: this.props.qnaId,
        versionAnswerId: this.state.versionAnswerIdBeforeReverting,
        prevVersionAnswerId: this.props.answer.id
      });
  }

  renderToolbar(markmirror, renderButton) {
    const { qnaId, answer, revertToPrevAnswer } = this.props;

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
            {answer.history.map(h => (
              <a
                class={`dropdown-item ${h.id === answer.id ? "active" : ""}`}
                onClick={() =>
                  revertToPrevAnswer({
                    versionQuestionId: qnaId,
                    versionAnswerId: h.id,
                    prevVersionAnswerId: answer.id
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
    const { answer, qnaId, handleCommentOnClick } = this.props;

    return (
      <div className="qna__answer-container editing-toolbar__hover-target">
        {this.state.editing ? (
          <div>
            <Markmirror
              key="answer-markmirror"
              defaultValue={this.props.answer.markdown}
              value={this.state.markdown}
              onChange={this.handleValueChange}
              renderToolbar={this.renderToolbar}
              ref={el => (this.markMirror = el)}
            />
            <ReactMarkdown
              className="markdown-body qna__question qna__question--editing mb-2 p-3"
              source={this.state.markdown}
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
          <div
            key={`qna-${qnaId}__answer--${answer.id}`}
            onClick={e => {
              handleCommentOnClick(e, qnaId, answer.id);
            }}
            className="markdown-body"
          >
            <ReactMarkdown className="qna__answer" source={answer.markdown} />
          </div>
        )}
        {!this.state.editing && (
          <div className="editing-toolbar__hover-targeted">
            <button
              className="btn btn-secondary"
              onClick={this.handleEditingOnClick}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  }
}
