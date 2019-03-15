import React, { Fragment } from "react";
import moment from "moment";
import ReactHtmlParser from "react-html-parser";
import { FeedItem, HeroHeader } from "../../../components";
import { QuestionFilter } from "./index";

export default ({
  questionSlugs,
  questionsBySlug,
  fetchQuestions,
  endOfResult,
  additionalQuestionsLoading
}) => (
  <div className="app-container">
    {questionSlugs.map(slug => (
      <FeedItem
        linkUrl={`/requests-for-comment/${questionsBySlug[slug].slug}`}
        title={questionsBySlug[slug].title}
        description={
          questionsBySlug[slug].description
            ? ReactHtmlParser(questionsBySlug[slug].description).filter(
                elem => elem.type === "p"
              )[0]
            : ""
        }
        tags={questionsBySlug[slug].tags}
        date={moment(questionsBySlug[slug].createdAt).format("LL")}
        creatorName={`${questionsBySlug[slug].owner.displayName}${
          questionsBySlug[slug].owner.delegate ? " (Reposted by BKP Admin)" : ""
        }`}
        numUpvotes={Number(questionsBySlug[slug].num_upvotes)}
        numDownvotes={Number(questionsBySlug[slug].num_downvotes)}
        numComments={Number(questionsBySlug[slug].num_comments)}
      />
    ))}
    <div className="text-center mb-5">
      {!endOfResult ? (
        <button className="btn btn-primary" onClick={fetchQuestions}>
          {additionalQuestionsLoading ? "Loading" : "Load more"}
        </button>
      ) : null}
    </div>
  </div>
);
