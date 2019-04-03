import React from "react";
import history from "../../../../../history";

export default ({
  upvotesFrom,
  downvotesFrom,
  hasUpvoted,
  hasDownvoted,
  myId,
  isAdmin,
  isQuestionOwner,
  downvoteQuestion,
  upvoteQuestion,
  slug
}) => {
  return (
    <div className="btn-group mb-2" role="group" aria-label="Basic example">
      <button
        type="button"
        className={`btn ${
          hasUpvoted
            ? "bg-consensys text-light"
            : "text-consensys btn-outline-primary"
        } project-document__upvote-btn`}
        onClick={upvoteQuestion}
      >
        <i className="fas fa-thumbs-up mr-2" />
        {upvotesFrom ? upvotesFrom.length : 0}
      </button>
      <button
        type="button"
        className={`btn ${
          hasDownvoted
            ? "bg-consensys text-light"
            : "text-consensys btn-outline-primary"
        } project-document__upvote-btn`}
        onClick={downvoteQuestion}
      >
        <i className="fas fa-thumbs-down mr-2" />
        {downvotesFrom ? downvotesFrom.length : 0}
      </button>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => history.push("/requests-for-comment")}
      >
        Back to browse
      </button>
      {isQuestionOwner || isAdmin ? (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => history.push(`/requests-for-comment/${slug}/edit`)}
        >
          edit
        </button>
      ) : null}
    </div>
  );
};
