import "./Conversation.scss";
import { isEmpty } from "lodash";
import React, { Fragment } from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { CommentBoxWithTagField } from "../../../../../components";

export default ({ question, addNewComment, me, id }) => {
  return (
    <div className="my-5">
      <p className="conversation-title">Join the conversation</p>
      <div className="d-flex">
        <Avatar
          className="mr-3"
          name={me.name && me.name.trim() ? me.name : "?"}
          size={46}
          src={(me && me.avatar_url) || "/assets/blank-avatar.png"}
          color={"#459DF9"}
          fgColor={"#ffffff"}
        />
        <div className="w-100">
          <CommentBoxWithTagField
            className="conversation-form"
            selectedTags={[]}
            showTags={true}
            initialValue=""
            question={question}
            onSubmit={addNewComment}
            documentId={id}
            notLoggedin={!me || isEmpty(me)}
            blockSubmitBtn={false}
          />
          {isEmpty(me) ? (
            <p className="conversation-auth-link">
              <Link className="text-primary" to="/login">
                Log in
              </Link>{" "}
              or{" "}
              <Link className="text-primary" to="/signup">
                Sign up
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

