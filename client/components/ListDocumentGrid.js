import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ListItemGrid } from "./index";

const getLatestVersionDate = documentById => {
  if (documentById.latest_version) {
    const latestVersion = documentById.latest_version;
    documentById.versions.forEach(version => {
      if (version.id === latestVersion) return version.createdAt;
    });
  }
  return documentById.versions[0].createdAt;
};

export default ({ documents }) => {
  return documents.length ? (
    <div className="row">
      {documents.map(document => {
        const date = moment(document.createdAt).format(
          "MMM DD YYYY"
        );
        const creatorRole =
          document.creator &&
          document.creator.roles[0] &&
          document.creator.roles[0].name;
        var tagArray = [
          `comments (${document.num_total_comments || 0})`,
          `upvotes (${document.num_upvotes || 0})`,
          `downvotes (${document.num_downvotes || 0})`
        ];
        if (
          !creatorRole ||
          (creatorRole !== "admin" && creatorRole !== "project_admin")
        )
          tagArray.push(`community contribution`);

        return (
          <ListItemGrid
            key={document.id}
            cardHref={`/s/${document.slug}`}
            mainTitle={document.title}
            subtitle={`by ${document.creator.name}`}
            textUpperRight={date}
            mainText={document.description || " "}
            tagArray={tagArray}
          />
        );
      })}
    </div>
  ) : null;
};
