import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { CommentBoxWithTagField } from "../index";
import Select from "react-select";

export default class EditCommentModal extends Component {
  static propTypes = {
    id: PropTypes.number,
    issue: PropTypes.object,
    quote: PropTypes.string,
    comment: PropTypes.comment,
    tags: PropTypes.array,
    editItem: PropTypes.func,
    loadModal: PropTypes.func,
    hideModal: PropTypes.func,
    showIssueCheckbox: PropTypes.boolean,
    showTags: PropTypes.boolean
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  onClose() {
    this.props.hideModal();
  }

  handleSubmitEditedComment(argObj) {
    this.props.editItem(argObj);
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.onClose}
        contentLabel="Edit Comment Modal"
      >
        <div className="comment-item--editing">
          <h5>Your annotation/comment</h5>
          <hr className="my-2" />
          <p className="comment-item--editing__quote mt-4">
            {this.props.quote}
          </p>
          <CommentBoxWithTagField
            issueOpen={this.props.issue ? this.props.issue.open : false}
            selectedTags={this.props.tags}
            initialValue={this.props.comment}
            commentId={this.props.id}
            versionId={this.props.version_id}
            showTags={this.props.showTags}
            showIssueCheckbox={this.props.showIssueCheckbox}
            onSubmit={this.handleSubmitEditedComment}
            onCancel={this.onClose}
          />
          <div className="comment-item--editing__action--bottom " />
        </div>
      </Modal>
    );
  }
}
