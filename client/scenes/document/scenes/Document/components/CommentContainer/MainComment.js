import React, { Component } from "react";
import autoBind from "react-autobind";
import { Link } from "react-router-dom";
import getUrls from "get-urls";
import Microlink from "react-microlink";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import { clone, find } from "lodash";
import { CommentBox } from "../index";
import { ActionableIssueTag, CommentItem } from "./index";
import { PunditContainer, PunditTypeSet, VisibleIf } from "react-pundit";
import policies from "../../../../../../policies.js";


export default ({
  collaboratorsArray,
  comment,
  user,
  projectMetadata,
  isClosedForComment,
  isLoggedIn,
  upvoteItem,
  changeItemIssueStatus,
  initReply,
  promptLoginToast,
  openModal,
  labelAsSpam,
  labelAsNotSpam
}) => {
  const hasUpvoted = find(
    comment.upvotesFrom,
    upvotedUser => upvotedUser.id === user.id
  );
  const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  let embeddedUrls = Array.from(getUrls(comment.comment));

  // Check for URL formatting issues
  // If URL is surrounded by parenthesis, find the URL
  // If URL cannot be parsed, don't add to embeddedUrls array
  embeddedUrls = embeddedUrls.map((url) => {
    if (url.includes('.)') || url.includes(')')) {
      const matchedUrl = url.match(regex);
      if (matchedUrl) {
        const urlToReturn = matchedUrl[0];
        if (urlToReturn[urlToReturn.length-1] === '.') {
          return urlToReturn.slice(0, urlToReturn.length - 1);
        }
        return urlToReturn;
      }
      return null;
    }
    return url;
  }).filter((url) => url !== null);

  const commentText = embeddedUrls.reduce(
    (comment, url) =>
      comment.replace(new RegExp(url, "g"), `[${url}](${url})`),
    comment.comment
  );
  const isAdmin = collaboratorsArray ? collaboratorsArray.includes(comment.owner.id) : false;

  return (
    <CommentItem
      isAdmin={isAdmin}
      containerClassName="comment-item__main"
      containerStyle={
        comment.descendents.length ? { borderBottom: "1px solid" } : {}
      }
      comment={comment}
      projectMetadata={projectMetadata}
      isClosedForComment={isClosedForComment}
      user={user}
      hasUpvoted={hasUpvoted}
      initReplyToThis={isLoggedIn ? () => initReply(comment) : promptLoginToast}
      upvoteItem={
        isLoggedIn
          ? () =>
              upvoteItem({
                rootId: null,
                comment,
                hasUpvoted
              })
          : promptLoginToast
      }
      openModal={() => openModal(comment, true, true)}
      labelAsSpam={labelAsSpam}
      labelAsNotSpam={labelAsNotSpam}
    >
      {comment.quote && <p className="comment-item__quote">{comment.quote}</p>}
      {(comment.tags && comment.tags.length) || comment.issue ? (
        <div className="comment-item__tags">
          <ActionableIssueTag
            comment={comment}
            changeItemIssueStatus={() => changeItemIssueStatus(comment)}
          />
          {comment.tags && comment.tags.length
            ? comment.tags.map(tag => (
                <span
                  key={`comment-${comment.id}__tag-${tag.name}`}
                  className="badge badge-light"
                >
                  {tag.name}
                  {"  "}
                </span>
              ))
            : ""}
        </div>
      ) : null}
      <ReactMarkdown className="comment-item__comment" source={commentText} />
      {embeddedUrls.length
        ? embeddedUrls.map((url, i) => (
            <Microlink
              key={`comment-${comment.id}__url-${i}`}
              apiKey={undefined}
              autoPlay
              contrast={false}
              controls
              image={["screenshot", "image", "logo"]}
              loop
              muted
              playsInline
              prerender="auto"
              reverse={false}
              screenshot={false}
              size="normal"
              style={{
                marginBottom: "2rem",
                width: "100%",
                height: "auto"
              }}
              url={url}
              video={false}
            />
          ))
        : null}
      {comment.issue && comment.issue.resolvingVersion ? (
        <span className="comment-item__issue-resolved">
          <Link
            to={`/project/${
              comment.issue.resolvingVersion.document.project.symbol
            }/document/${comment.issue.resolvingVersion.document.id}/version/${
              comment.issue.resolvingVersion.id
            }`}
          >{`issue resolved in document v${
            comment.issue.resolvingVersion.hierarchyLevel
          }`}</Link>
        </span>
      ) : null}
    </CommentItem>
  );
};
