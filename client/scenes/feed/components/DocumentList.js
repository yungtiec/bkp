import React, { Fragment } from "react";
import { FeedItem } from "../../../components";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";

export default ({
  documentIds,
  documentsById,
  fetchFilteredDocumentsWithStats,
  endOfResult,
  additionalDocumentsLoading
}) => (
  <Fragment>
    {documentIds.map(id => (
      <FeedItem
        linkUrl={`/s/${documentsById[id].slug}`}
        imgUrl={documentsById[id].header_img_url}
        category={documentsById[id].category.replace(/-/g, " ")}
        title={documentsById[id].title}
        description={
          documentsById[id].description
            ? ReactHtmlParser(documentsById[id].description).filter(
                elem => elem.type === "p"
              )[0]
            : ReactHtmlParser(documentsById[id].content_html).filter(
                elem => elem.type === "p"
              )[0]
        }
        tags={documentsById[id].tags}
        date={moment(documentsById[id].createdAt).format("LL")}
        creatorName={`${documentsById[id].creator.displayName}${
          documentsById[id].creator.delegate ? " (Reposted by BKP Admin)" : ""
        }`}
        numUpvotes={Number(documentsById[id].num_upvotes)}
        numDownvotes={Number(documentsById[id].num_downvotes)}
        numComments={Number(documentsById[id].num_comments)}
      />
    ))}
    <div className="text-center mb-5">
      {!endOfResult ? (
        <button
          className="btn btn-primary"
          onClick={fetchFilteredDocumentsWithStats}
        >
          {additionalDocumentsLoading ? "Loading" : "Load more"}
        </button>
      ) : null}
    </div>
  </Fragment>
);
