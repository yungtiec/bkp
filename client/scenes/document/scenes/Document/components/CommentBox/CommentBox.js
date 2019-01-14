import React, { Component } from "react";
import autoBind from "react-autobind";

export default class CommentBox extends Component {
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
        />
        {this.props.onCancel ? (
          <div className="comment-box__actions">
            <button className="btn btn-primary" onClick={this.handleSubmit}>
              comment
            </button>
            <button className="btn" onClick={this.props.onCancel}>
              cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-block mt-4"
            onClick={this.handleSubmit}
          >
            comment
          </button>
        )}
      </div>
    );
  }
}
