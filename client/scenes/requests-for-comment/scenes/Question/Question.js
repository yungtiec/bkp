import React, { Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { find } from "lodash";
import { HeroHeader, TagChip } from "../../../../components";
import { QuestionEditor } from "../../components";
import { Conversation, QueryComments, QuestionToolbar } from "./components";

const Question = ({
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

  const isAdmin =
    me.roles &&
    me.roles.length &&
    me.roles.filter(r => r.name === "admin").length;

  return (
    <div className="app-container">
      <HeroHeader
        title={question.title}
        subtitle={`by ${question.owner.name}
      ${question.owner.delegate ? " (Reposted By BKP Admin)" : ""} `}
      />
      <QuestionToolbar
        upvotesFrom={question.upvotesFrom}
        downvotesFrom={question.downvotesFrom}
        myId={me.id}
        isAdmin={isAdmin}
        isQuestionOwner={me.id === question.owner.id}
        hasUpvoted={hasUpvoted}
        hasDownvoted={hasDownvoted}
        upvoteQuestion={() =>
          upvoteQuestion({ hasUpvoted, hasDownvoted, question })
        }
        downvoteQuestion={() =>
          downvoteQuestion({ hasUpvoted, hasDownvoted, question })
        }
        slug={match && match.params.slug}
      />
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

export default props => {
  return (
    <Switch>
      <Route
        path={`${props.match.url}/edit`}
        render={() => (
          <QuestionEditor
            me={props.me}
            editQuestion={props.editQuestion}
            question={props.question}
          />
        )}
      />
      <Route
        path={`${props.match.url}`}
        render={() => <Question {...props} />}
      />
    </Switch>
  );
};
