import "./SidebarHeader.scss";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import autoBind from "react-autobind";
import Select from "react-select";
import { keys } from "lodash";
import { CommentBoxWithTagField, Countdown } from "../index";
import { withRouter } from "react-router-dom";
import { signinWithUport } from './../../../../../../../client/data/reducer.js'

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
      versionMetadata,
      addNewComment,
      isClosedForComment
    } = this.props;

    console.log('props', this.props);

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
              timeInUnix={Number(versionMetadata.comment_until_unix)}
            />
            {!isClosedForComment && isLoggedIn ? (
              <CommentBoxWithTagField
                showTags={true}
                showIssueCheckbox={true}
                tags={tags}
                selectedTags={[]}
                initialValue=""
                versionId={versionMetadata.id}
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
                    <div className="sidebar__login-container-flex">
                      <div className="sidebar__login-container d-flex">
                        <span className="sidebar__signin-text mb-2"> To join the conversation: </span>
                        <a
                          href={`/auth/google?state=${encodeURI(
                            this.props.location.pathname
                          )}`}
                        >
                          <img src="/assets/btn_google_signin_dark_normal_web.png" />
                        </a>
                        <a onClick={signinWithUport}>
                          <img src="/assets/btn_uport_signin_dark_normal_web.png"
                          />
                        </a>
                        <a
                          href={`/auth/github?state=${encodeURI(
                            this.props.location.pathname
                          )}`}
                        >
                          <img className="btn-github" src="/assets/btn-github-dark.png" />
                        </a>
                        <div class="d-flex mt-2">
                          <span className="sidebar__signin-text">or sign in with</span>
                          <Link
                            to={{
                              pathname: "/login",
                              state: { lastPath: this.props.location.pathname }
                            }}
                            className="text-primary font-weight-bold sidebar__signin-text"
                          >
                            email
                          </Link>
                        </div>
                      </div>
                      </div>
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
