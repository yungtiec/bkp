import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";

export default class CommentBox extends Component {
  static propTypes = {
    rootId: PropTypes.number,
    parentId: PropTypes.number,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    notLoggedin: PropTypes.boolean,
    blockSubmitBtn: PropTypes.boolean,
    initialValue: PropTypes.string,
    documentId: PropTypes.number,
    question: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
    autoBind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    if (this.state.value) {
      this.props.onSubmit({
        ...this.props,
        newComment: this.state.value
      });
      this.setState({
        value: ""
      });
      if (typeof this.props.onCancel === "function") this.props.onCancel();
    }
  }

  render() {
    return (
      <div className="comment-box">
        <textarea
          className="comment-box__text-area"
          name="textarea"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Please give feedback..."
          disabled={this.props.notLoggedin}
        />
        {this.props.notLoggedin ? null : this.props.onCancel ? (
          <div className="comment-box__actions">
            <button
              className="btn btn-primary"
              onClick={this.handleSubmit}
              disabled={this.props.notLoggedin}
            >
              comment
            </button>
            <button className="btn" onClick={this.props.onCancel}>
              cancel
            </button>
          </div>
        ) : (
          <button
            className={`btn btn-primary ${
              this.props.blockSubmitBtn ? "btn-block" : "btn-right-align"
            } mt-4`}
            onClick={this.handleSubmit}
            disabled={this.props.notLoggedin}
          >
            comment
          </button>
        )}
      </div>
    );
  }
}
