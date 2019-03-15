import React from "react";
import ReactHtmlParser from "react-html-parser";
import { find } from "lodash";
import { HeroHeader, TagChip } from "../../../../components";
import { Conversation, QueryComments } from "./components";
import history from "../../../../history";

export default ({
  match,
  me,
  question,
  downvoteQuestion,
  upvoteQuestion,
  addNewComment
}) => {
  const hasUpvoted = !!find(
    question.upvotesFrom,
    upvotedUser => upvotedUser.id === me.id
  );

  const hasDownvoted = !!find(
    question.downvotesFrom,
    downvotedUser => downvotedUser.id === me.id
  );

  return (
    <div className="app-container">
      <HeroHeader
        title={question.title}
        subtitle={`by ${question.owner.name}
      ${question.owner.delegate ? " (Reposted By BKP Admin)" : ""} `}
      />
      <div className="btn-group mb-2" role="group" aria-label="Basic example">
        <button
          type="button"
          className={`btn ${
            hasUpvoted
              ? "bg-consensys text-light"
              : "text-consensys btn-outline-primary"
          } project-document__upvote-btn`}
          onClick={() => upvoteQuestion({ hasUpvoted, hasDownvoted, question })}
        >
          <i className="fas fa-thumbs-up mr-2" />
          {question.upvotesFrom ? question.upvotesFrom.length : 0}
        </button>
        <button
          type="button"
          className={`btn ${
            hasDownvoted
              ? "bg-consensys text-light"
              : "text-consensys btn-outline-primary"
          } project-document__upvote-btn`}
          onClick={() =>
            downvoteQuestion({ hasUpvoted, hasDownvoted, question })
          }
        >
          <i className="fas fa-thumbs-down mr-2" />
          {question.downvotesFrom ? question.downvotesFrom.length : 0}
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => history.push("/requests-for-comment")}
        >
          Back to browse
        </button>
      </div>
      <div className="mb-5" style={{ lineHeight: 1.5 }}>
        Tags:{" "}
        {question.tags && question.tags.length
          ? question.tags.map((tag, index) => (
              <TagChip
                key={`tag__${tag.name}`}
                containerClassname="tag-field__tag dark-bg"
                tagValue={tag.name}
              />
            ))
          : ""}
      </div>
      {question.description ? (
        <p>{ReactHtmlParser(question.description)}</p>
      ) : null}
      <Conversation question={question} addNewComment={addNewComment} me={me} />
      <QueryComments />
    </div>
  );
};
