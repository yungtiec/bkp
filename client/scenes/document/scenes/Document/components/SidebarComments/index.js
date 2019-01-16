import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarContents from "./SidebarContents";
import { Element } from "react-scroll";

export default ({
  documentMetadata,
  isLoggedIn,
  anonymity,
  commentIds,
  commentsById,
  nonSpamCommentIds,
  versionMetadata,
  projectMetadata,
  commentSortBy,
  sortCommentBy,
  tags,
  tagFilter,
  updateTagFilter,
  tagsWithCountInDocument,
  commentIssueFilter,
  updateIssueFilter,
  isClosedForComment,
  addNewComment,
  selectedComments,
  selectedText,
  resetCommentSelection,
  parent
}) => {
  const { creator_id, collaborators } = documentMetadata;
  const collaboratorsArray = (collaborators || []).reduce(
    (acc, curr) => {
      return acc.concat([curr.id]);
    },
    [creator_id]
  );

  return (
    <Element
      name="sidebar-contents"
      id="sidebar-contents"
      className="sidebar-contents"
    >
      <SidebarHeader
        commentSortBy={commentSortBy}
        sortCommentBy={sortCommentBy}
        nonSpamCommentIds={nonSpamCommentIds}
        selectedComments={selectedComments}
        tagFilter={tagFilter}
        updateTagFilter={updateTagFilter}
        tagsWithCountInDocument={tagsWithCountInDocument}
        isLoggedIn={isLoggedIn}
        anonymity={anonymity}
        isClosedForComment={isClosedForComment}
        resetCommentSelection={resetCommentSelection}
        commentIssueFilter={commentIssueFilter}
        updateIssueFilter={updateIssueFilter}
        tags={tags}
        documentMetadata={documentMetadata}
        addNewComment={addNewComment}
      />
      <SidebarContents
        collaboratorsArray={collaboratorsArray}
        isLoggedIn={isLoggedIn}
        isClosedForComment={isClosedForComment}
        commentIds={commentIds}
        commentsById={commentsById}
        selectedText={selectedText}
        selectedComments={selectedComments}
        projectMetadata={projectMetadata}
        tags={tags}
        parent={parent}
      />
    </Element>
  );
};
