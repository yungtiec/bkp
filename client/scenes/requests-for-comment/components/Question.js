import React from "react";
import ReactHtmlParser from "react-html-parser";
import { find } from "lodash";
import { HeroHeader } from "../../../components";

export default ({ match, me, question, downvoteQuestion, upvoteQuestion }) => {
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
        title="Request For Comment"
        subtitle={`by ${question.owner.name}
      ${question.owner.delegate ? " (Reposted By BKP Admin)" : ""} `}
      />
      <p>{question.title}</p>
      {question.description ? (
        <p>{ReactHtmlParser(question.description)}</p>
      ) : null}
      <div>
        <a
          className="contribution__action-btn"
          onClick={() => upvoteQuestion({ hasUpvoted, hasDownvoted, question })}
        >
          <i className="fas fa-thumbs-up" />
          <span>{question.upvotesFrom.length || 0}</span>
        </a>
        <a
          className="contribution__action-btn"
          onClick={() =>
            downvoteQuestion({ hasUpvoted, hasDownvoted, question })
          }
        >
          <i className="fas fa-thumbs-down" />
          <span>{question.downvotesFrom.length || 0}</span>
        </a>
        <a className="contribution__action-btn">
          <i className="fas fa-comment" />
          <span>{question.comments.length || 0}</span>
        </a>
      </div>
    </div>
  );
};
