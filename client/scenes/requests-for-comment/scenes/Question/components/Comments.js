import React from "react";

export default ({ commentIds, commentsById, me }) => (
  <div>
    {commentIds.map(id => (
      <CommentContainer
        comment={commentsById[id]}
        user={me}
        replyToItem={() => {}}
      />
    ))}
  </div>
);
