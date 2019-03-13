import React from "react";
import ReactHtmlParser from "react-html-parser";
import { find } from "lodash";
import { HeroHeader } from "../../../../components";
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
      <div className="btn-group mb-5" role="group" aria-label="Basic example">
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
      {question.description ? (
        <p>{ReactHtmlParser(question.description)}</p>
      ) : null}
      <Conversation question={question} addNewComment={addNewComment} me={me} />
      <QueryComments />
    </div>
  );
};
