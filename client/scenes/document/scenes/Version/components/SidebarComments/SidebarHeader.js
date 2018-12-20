import "./SidebarHeader.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import Select from "react-select";
import { keys } from "lodash";
import { CommentBoxWithTagField, Countdown } from "../index";
import { withRouter } from "react-router-dom";

class SidebarHeader extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleSortByChange(selectedOption) {
    if (selectedOption.value !== this.props.commentSortBy) {
      this.props.sortCommentBy(selectedOption.value);
    }
  }

  renderCommentSortBy({ commentSortBy }) {
    return (
      <div
        className="sidebar__sort-by btn-group"
        role="group"
        aria-label="Basic example"
      >
        <span>sort comments by</span>
        <Select
          name="form-field-name"
          value={commentSortBy}
          onChange={this.handleSortByChange}
          options={[
            { value: "position", label: "position" },
            { value: "timestamp", label: "date" },
            { value: "upvotes", label: "upvotes" }
          ]}
        />
      </div>
    );
  }

  handleTagFilterChange(selectedOptions) {
    const { updateTagFilter } = this.props;
    if (selectedOptions) {
      updateTagFilter(selectedOptions);
    }
  }

  handleIssueFilterChange(selectedOptions) {
    const { updateIssueFilter } = this.props;
    if (selectedOptions) {
      updateIssueFilter(selectedOptions.map(s => s.value));
    }
  }

  render() {
    const {
      isLoggedIn,
      selectedComments,
      nonSpamCommentIds,
      commentSortBy,
      tagsWithCountInDocument,
      tagFilter,
      updateTagFilter,
      commentIssueFilter,
      tags,
      documentMetadata,
      addNewComment,
      isClosedForComment
    } = this.props;

    return (
      <div>
        {selectedComments && !selectedComments.length ? (
          <div className="sidebar__title-container">
            <p className="sidebar__title">
              Comments ({nonSpamCommentIds.length})
            </p>
          </div>
        ) : (
          <div className="sidebar__title-container">
            <p
              className="sidebar__title active reset-selection"
              onClick={this.props.resetCommentSelection}
            >
              Show all Comments ({nonSpamCommentIds.length})
            </p>
          </div>
        )}
        {selectedComments &&
          !selectedComments.length &&
          this.renderCommentSortBy({
            commentSortBy
          })}
        {selectedComments && !selectedComments.length ? (
          <div
            className={`comment-item ${
              isClosedForComment ? "page-comment--highlight" : "page-comment"
            }`}
          >
            <Countdown
              timeInUnix={Number(documentMetadata.comment_until_unix)}
            />
            {!isClosedForComment && isLoggedIn ? (
              <CommentBoxWithTagField
                showTags={true}
                showIssueCheckbox={true}
                tags={tags}
                selectedTags={[]}
                initialValue=""
                versionId={documentMetadata.id}
                onSubmit={addNewComment}
                onCancel={null}
              />
            ) : null}
          </div>
        ) : null}
        {!isLoggedIn && (
          <div className="comment-item mt-4">
            <div className="comment-item__main">
              <div className="comment-item__header">
                {isClosedForComment ? (
                  <p className="mb-0">
                    <Link
                      to={{
                        pathname: "/login",
                        state: { lastPath: this.props.location.pathname }
                      }}
                      className="text-primary font-weight-bold"
                    >
                      Log in
                    </Link>{" "}
                    or{" "}
                    <Link
                      to={{
                        pathname: "/signup",
                        state: { lastPath: this.props.location.pathname }
                      }}
                      className="text-primary font-weight-bold"
                    >
                      Sign up here
                    </Link>{" "}
                    for notifications
                  </p>
                ) : (
                  <p className="mb-0">
                    <Link
                      to={{
                        pathname: "/login",
                        state: { lastPath: this.props.location.pathname }
                      }}
                      className="text-primary font-weight-bold"
                    >
                      Log in
                    </Link>{" "}
                    or{" "}
                    <Link
                      to={{
                        pathname: "/signup",
                        state: { lastPath: this.props.location.pathname }
                      }}
                      className="text-primary font-weight-bold"
                    >
                      sign up
                    </Link>{" "}
                    to comment
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SidebarHeader);
