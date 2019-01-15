import React from "react";
import { CommentMain, CommentReply } from "../../../components";
import history from "../../../history";
import { find } from "lodash";
import { seeCommentContext } from "../../../utils";

const ancestorIsSpam = ancestors =>
  ancestors.reduce((bool, a) => a.reviewed === "spam" || bool, false);

export default ({ commentsById, commentIds }) => (
  <div>
    {!commentIds.length && (
      <p style={{ marginTop: "35px" }}>You haven't made any comment.</p>
    )}
    {commentIds.map(
      aid =>
        commentsById[aid].parentId ? (
          <CommentReply
            key={`profile__comment-reply--${aid}`}
            comment={commentsById[aid]}
          >
            <a
              key={`profile__comment-reply--${aid}`}
              className="see-in-context"
              onClick={() => seeCommentContext(commentsById[aid])}
            >
              {commentsById[aid].reviewed !== "spam" &&
                !ancestorIsSpam(commentsById[aid].ancestors) &&
                "see in context"}
            </a>
            {commentsById[aid].reviewed !== "spam" &&
              ancestorIsSpam(commentsById[aid].ancestors) &&
              "reply no longer exists because the thread contains spam"}
          </CommentReply>
        ) : (
          <CommentMain
            key={`profile__comment-main--${aid}`}
            comment={commentsById[aid]}
          >
            <a
              key={`profile__comment-main--${aid}`}
              className="see-in-context"
              onClick={() => seeCommentContext(commentsById[aid])}
            >
              {commentsById[aid].reviewed !== "spam" && "see in context"}
            </a>
          </CommentMain>
        )
    )}
  </div>
);
