import "./Comment.scss";
import React from "react";
import Avatar from "react-avatar";
import { CommentContainer } from "../../../../../components";

export default ({
  commentIds,
  commentsById,
  me,
  replyToComment,
  upvoteComment,
  editComment,
  loadModal,
  hideModal,
  notify
}) => (
  <div className="mb-5">
    {commentIds &&
      commentIds.map(id => {
        console.log(commentsById[id]);
        return (
          <div className="requests-for-comment__comment d-flex">
            <Avatar
              className="mt-3 mr-3"
              name={
                commentsById[id].owner.name && commentsById[id].owner.name.trim()
                  ? commentsById[id].owner.name
                  : "?"
              }
              size={46}
              src={
                (commentsById[id].owner && commentsById[id].owner.avatar_url) ||
                "/assets/blank-avatar.png"
              }
              color={"#459DF9"}
              fgColor={"#ffffff"}
            />
            <CommentContainer
              comment={commentsById[id]}
              user={me}
              replyToItem={replyToComment}
              editItem={editComment}
              upvoteItem={upvoteComment}
              loadModal={loadModal}
              hideModal={hideModal}
              notify={notify}
              isLoggedIn={me && me.id}
              isClosedForComment={false}
              lightMode={true}
            />
          </div>
        )
      })}
  </div>
);
