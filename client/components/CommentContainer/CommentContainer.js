import "./CommentContainer.scss";
import React, { Component } from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import { CommentBox } from "../index";
import { Replies, MainComment } from "./index";
import policies from "../../policies.js";

export default class CommentContainer extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    projectMetadata: PropTypes.object,
    user: PropTypes.object.isRequired,
    replyToItem: PropTypes.func,
    verifyItemAsAdmin: PropTypes.func,
    upvoteItem: PropTypes.func,
    editItem: PropTypes.func,
    changeItemIssueStatus: PropTypes.func,
    loadModal: PropTypes.func,
    notify: PropTypes.func,
    isLoggedIn: PropTypes.boolean,
    isClosedForComment: PropTypes.boolean,
    darkText: PropTypes.boolean
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isCommenting: false,
      replyTarget: null,
      showReplies: false
    };
  }

  initReply(replyTarget) {
    this.setState({
      isCommenting: true,
      replyTarget
    });
  }

  hideCommentBox(accessors, parent) {
    this.setState({
      isCommenting: false,
      parentId: null
    });
  }

  openModal(comment, showIssueCheckbox, showTags) {
    this.props.loadModal("EDIT_COMMENT_MODAL", {
      ...comment,
      showIssueCheckbox,
      showTags,
      editItem: this.props.editItem
    });
  }

  promptLoginToast() {
    this.props.notify({
      title: "",
      message: "Login required",
      status: "error",
      dismissible: true,
      dismissAfter: 3000
    });
  }

  labelAsNotSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({
      comment,
      rootId,
      reviewed: comment.reviewed === "verified" ? "pending" : "verified"
    });
  }

  labelAsSpam(comment, rootId) {
    this.props.verifyItemAsAdmin({
      comment,
      rootId,
      reviewed: comment.reviewed === "spam" ? "pending" : "spam"
    });
  }

  toggleShowReplies() {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies
    }));
  }

  render() {
    const {
      collaboratorsArray,
      comment,
      user,
      projectMetadata,
      isClosedForComment,
      isLoggedIn,
      upvoteItem,
      changeItemIssueStatus,
      verifyItemAsAdmin,
      darkText
    } = this.props;

    return (
      <PunditContainer policies={policies} user={user}>
        <PunditTypeSet type="Comment">
          <VisibleIf
            action="Read"
            model={{ project: projectMetadata, comment }}
          >
            <div className="comment-item">
              <MainComment
                collaboratorsArray={collaboratorsArray}
                comment={comment}
                user={user}
                projectMetadata={projectMetadata}
                isClosedForComment={isClosedForComment}
                isLoggedIn={isLoggedIn}
                upvoteItem={upvoteItem}
                changeItemIssueStatus={changeItemIssueStatus}
                initReply={this.initReply}
                promptLoginToast={this.promptLoginToast}
                openModal={this.openModal}
                labelAsSpam={this.labelAsSpam}
                labelAsNotSpam={verifyItemAsAdmin ? this.labelAsNotSpam : null}
                darkText={darkText}
              />
              <Replies
                collaboratorsArray={collaboratorsArray}
                showReplies={this.state.showReplies}
                toggleShowReplies={this.toggleShowReplies}
                comment={comment}
                user={user}
                projectMetadata={projectMetadata}
                isLoggedIn={isLoggedIn}
                upvoteItem={upvoteItem}
                openModal={this.openModal}
                initReply={this.initReply}
                promptLoginToast={this.promptLoginToast}
                isClosedForComment={isClosedForComment}
                labelAsSpam={this.labelAsSpam}
                labelAsNotSpam={verifyItemAsAdmin ? this.labelAsNotSpam : null}
                darkText={darkText}
              />
              {this.state.isCommenting ? (
                <div>
                  {this.state.replyTarget && (
                    <span className="ml-1">{`replying to ${
                      this.state.replyTarget.owner.displayName
                    }`}</span>
                  )}
                  <CommentBox
                    rootId={comment.id}
                    parentId={
                      this.state.replyTarget
                        ? this.state.replyTarget.id
                        : comment.id
                    }
                    onSubmit={this.props.replyToItem}
                    onCancel={this.hideCommentBox}
                  />
                </div>
              ) : null}
            </div>
          </VisibleIf>
        </PunditTypeSet>
      </PunditContainer>
    );
  }
}
