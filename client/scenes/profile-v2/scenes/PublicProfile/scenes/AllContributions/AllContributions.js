import React, { Component } from "react";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { ListItem } from "../../../../../../components";
import moment from "moment";

const AllContribution = ({
  gridClassnames,
  contributionsById,
  contributionIds
}) => {
  return (
    <div className={`${gridClassnames}`}>
      {contributionIds.map(
        cid =>
          contributionsById[cid].comment ? (
            <ListItem
              cardKey={cid}
              cardHref=""
              mainTitle={contributionsById[cid].comment}
              quote={contributionsById[cid].quote}
              subtitle={""}
              textUpperRight={moment(
                contributionsById[cid].createdAt
              ).fromNow()}
              mainText={""}
            />
          ) : (
            <ListItem
              cardKey={cid}
              cardHref=""
              mainTitle={contributionsById[cid].title}
              subtitle={""}
              textUpperRight={moment(
                contributionsById[cid].createdAt
              ).fromNow()}
              mainText={""}
            />
          )
      )}
    </div>
  );
};

export default withRouter(AllContribution);
