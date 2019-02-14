import React from "react";
import { CommentCard } from "../../../components";

export default ({
  commentsById,
  commentIds,
  commentEndOfResult,
  additionalCommentsLoading,
  fetchCommentsWithResponse,
  mobile
}) => (
  <div class={`dashboard__recent-comments ${mobile ? "" : "ml-5"}`}>
    <p className="dashboard__recent-comments-title pl-1">Recent comments</p>
    {!commentIds || (commentIds && !commentIds.length) ? (
      <div className="component__loader-container d-flex">
        currently has no comment available
      </div>
    ) : (
      commentIds.map(id => (
        <CommentCard
          comment={commentsById[id]}
          userHandle={commentsById[id].owner.user_handle}
        />
      ))
    )}
    <button
      className="btn btn-primary mt-4"
      onClick={() => fetchCommentsWithResponse(true)}
    >
      {additionalCommentsLoading ? "loading" : "load more"}
    </button>
  </div>
);
