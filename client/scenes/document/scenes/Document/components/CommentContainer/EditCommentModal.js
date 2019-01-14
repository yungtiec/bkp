import React, { Component } from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import Modal from "react-modal";
import { hideModal } from "../../../../../../data/reducer";
import { editComment } from "../../../../data/comments/actions";
import { getAllTags } from "../../../../data/tags/reducer";
import { CommentBox, CommentBoxWithTagField } from "../index";
import { TagChip } from "../../../../../../components";
import Select from "react-select";

class EditCommentModal extends Component {
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
            tags={this.props.availableTags}
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

const mapState = (state, ownProps) => ({
  ...ownProps,
  availableTags: getAllTags(state)
});

const actions = {
  hideModal,
  editComment
};

export default connect(mapState, actions)(EditCommentModal);
