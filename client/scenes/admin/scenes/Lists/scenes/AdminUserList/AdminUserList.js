import "./AdminUserList.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import autoBind from "react-autobind";
import {
  requiresAuthorization,
  StackableTable
} from "../../../../../../components";
import history from "../../../../../../history";
import { changeAccessStatus } from "./data/actions";

const AdminUserList = ({
  userIds,
  usersById,
  restrictAccess,
  restoreAccess
}) => {
  const columns = [
    { Header: "user handle", accessor: "user_handle"},
    { Header: "email", accessor: "email"},
    { Header: "spam", accessor: "num_spam" },
    {
      id: "comments",
      Header: "comments",
      accessor: "num_comments"
    },
    {
      id: "votes",
      Header: "votes",
      accessor: "num_votes"
    },
    { Header: "issues open", accessor: "num_issues" },
    { Header: "id", accessor: "id", show: false },
    {
      Header: "access",
      accessor: "restricted_access",
      Cell: rowInfo => {
        return rowInfo.row.restricted_access ? (
          <button className="btn btn-outline-primary">restore access</button>
        ) : (
          <button className="btn btn-outline-danger">restrict access</button>
        );
      }
    }
  ];
  const data = userIds.map(id => usersById[id]);

  const callFunc = (msg) => {
    console.log('okay')
  };

  console.log(data);

  return (
    <div className="user-list__container  main-container">
      <StackableTable
        columns={columns}
        data={data}
        defaultPageSize={10}
        getTrProps={(state, rowInfo, column, instance) => {
          console.log(rowInfo);
          return {
            onClick: (e, handleOriginal) => {
              if (e.target.className.indexOf("btn") === -1)
                history.push(`/profile/@${rowInfo.original.user_handle}`);
              else {
                if (rowInfo.row.restricted_access) {
                  restoreAccess(rowInfo.row.id);
                } else {
                  restrictAccess(rowInfo.row.id);
                }
              }
            }
          };
        }}
      />
    </div>
  );
};

export default withRouter(
  requiresAuthorization({
    Component: AdminUserList,
    roleRequired: ["admin"]
  })
);
