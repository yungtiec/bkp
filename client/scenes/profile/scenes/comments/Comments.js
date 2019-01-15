import React from "react";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { ProfileSidebar, ProfileCommentItems } from "../../components";

export default ({
  commentsById,
  commentIds,
  projectsBySymbol,
  projectSymbolArr,
  pageCount,
  pageLimit,
  pageOffset,
  pageProjectFilter,
  pageDocumentFilter,
  checked,
  checkSidebarFilter,
  updatePageOffset,
  updateProjectFilter
}) => (
  <div className="profile-engagement-items__container main-container">
    <ProfileSidebar
      checked={checked}
      checkSidebarFilter={checkSidebarFilter}
      nodes={[
        {
          value: "status",
          label: "STATUS",
          children: [
            { value: "verified", label: "Verified" },
            { value: "spam", label: "Spam" },
            { value: "pending", label: "Pending" }
          ]
        },
        {
          value: "issue",
          label: "ISSUE",
          children: [
            { value: "open", label: "Open" },
            { value: "close", label: "Close" }
          ]
        }
      ]}
    >
      <span>FILTER BY PROJECT(S)</span>
      <Select
        name="profile-comments__project-select"
        multi={true}
        value={pageProjectFilter}
        onChange={updateProjectFilter}
        options={projectSymbolArr.map(symbol => ({
          label: projectsBySymbol[symbol].name.toUpperCase(),
          value: projectsBySymbol[symbol].id
        }))}
      />
    </ProfileSidebar>
    <div className="d-flex flex-column profile-enagement-items">
      <ProfileCommentItems
        commentsById={commentsById}
        commentIds={commentIds}
      />
      {commentIds.length && pageCount > 1 ? (
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={<a href="">...</a>}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={updatePageOffset}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      ) : null}
    </div>
  </div>
);
