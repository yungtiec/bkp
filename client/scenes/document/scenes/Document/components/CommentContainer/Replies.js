import React, { Component, Fragment } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import moment from "moment";
import { cloneDeep, isEmpty, find, orderBy, assignIn } from "lodash";
import { CommentBox } from "../index";
import { ActionBar, CommentItem } from "./index";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";

export default class Replies extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { showReplies, toggleShowReplies, comment } = this.props;

    return (
      <Fragment>
        {showReplies && (
          <p
            className="mt-3 mb-0 comment-item__collapse-btn"
            onClick={toggleShowReplies}
          >
            - Collapse replies
          </p>
        )}
        {comment.descendents.length < 3 || showReplies ? (
          <div className="ml-3">
            {this.renderReplies(comment.descendents, comment.id)}
          </div>
        ) : (
          <p className="my-3" onClick={toggleShowReplies}>
            + View{" "}
            {comment.descendents.filter(c => c.reviewed !== "spam").length}{" "}
            replies
          </p>
        )}
      </Fragment>
    );
  }

  renderReplies(replies, rootId) {
    const {
      collaboratorsArray,
      comment,
      user,
      projectMetadata,
      isLoggedIn,
      upvoteItem,
      openModal,
      initReply,
      promptLoginToast,
      isClosedForComment,
      labelAsSpam,
      labelAsNotSpam
    } = this.props;
    return orderBy(
      replies.map(
        reply =>
          isEmpty(reply)
            ? reply
            : assignIn({ unix: moment(reply.createdAt).format("X") }, reply)
      ),
      ["unix", "upvotesFrom.length"],
      ["asc", "desc"]
    ).map((reply, i) => {
      const hasUpvoted = find(
        reply.upvotesFrom,
        upvotedUser => upvotedUser.id === user.id
      );
      const isAdmin =
        collaboratorsArray && collaboratorsArray.includes(reply.owner.id);
      return (
        <CommentItem
          isAdmin={isAdmin}
          containerClassName={`comment-item__reply-item ${
            i === replies.length - 1 ? "last-item" : ""
          }`}
          comment={reply}
          projectMetadata={projectMetadata}
          isClosedForComment={isClosedForComment}
          user={user}
          hasUpvoted={hasUpvoted}
          initReplyToThis={
            isLoggedIn ? () => initReply(reply) : promptLoginToast
          }
          upvoteItem={() =>
            upvoteItem({
              rootId,
              comment: reply,
              hasUpvoted
            })
          }
          openModal={() => openModal(reply, false, false)}
          labelAsSpam={() => labelAsSpam(reply, rootId)}
          labelAsNotSpam={() => labelAsNotSpam(reply, rootId)}
        >
          {reply.reviewed === "spam" ? (
            <p className="comment-item__comment">[deleted]</p>
          ) : (
            <p className="comment-item__comment">
              {reply.hierarchyLevel !== 2 && (
                <span className="comment-item__at-someone">
                  {"@" + reply.parent.owner.displayName}
                </span>
              )}{" "}
              {reply.comment}
            </p>
          )}
        </CommentItem>
      );
    });
  }
}
