import "./AdminDocumentList.scss";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  requiresAuthorization,
  StackableTable
} from "../../../../../../components";
import history from "../../../../../../history";
import { maxBy } from "lodash";
import Select from 'react-select';
import moment from 'moment';

const AdminDocumentList = ({ documents, putStatusBySlug, loadInitialData, documentUpdatedSuccessfully, documentUpdated }) => {
  const callFunc = async (rowInfo, status) => {
    console.log({rowInfo});
    let docStatus;
    if (status.value === 'draft') {
      docStatus = { submitted: false, reviewed: false};
    } else if (status.value === 'published') {
      docStatus = { submitted: true, reviewed: false};
    } else if (status.value === 'featured') {
      docStatus = { submitted: true, reviewed: true};
    }
    try {
      await putStatusBySlug(rowInfo.original.slug, {
        status : docStatus,
      });
      await loadInitialData();
      documentUpdatedSuccessfully();
    }
  };

  const options = [
    { label: "Draft", value: 'draft' },
    { label: "Published", value: 'published' },
    { label: "Featured", value: 'featured' }
  ];

  const columns = [
    { Header: "createdAt", accessor: "createdAt", minWidth: 50, Cell: rowInfo => { return <span>{moment(rowInfo.original.createdAt).format('L')}</span>} },
    { Header: "updatedAt", accessor: "updatedAt", minWidth: 50, Cell: rowInfo => { return <span>{moment(rowInfo.original.updatedAt).format('L')}</span>} },
    { Header: "title", accessor: "title", minWidth: 150 },
    { Header: "creator", accessor: "creator.displayName", minWidth: 75 },
    {
      Header: "state",
      accessor: "submitted",
      Cell: rowInfo => {
        let docStatus;
        if (!rowInfo.original.submitted && !rowInfo.original.reviewed) {
          docStatus = 'draft';
        } else if (rowInfo.original.submitted && !rowInfo.original.reviewed) {
          docStatus = 'published';
        } else if (rowInfo.original.submitted && rowInfo.original.reviewed) {
          docStatus = 'featured';
        }
        return <Select
          value={docStatus}
          onChange={(evt) => callFunc(rowInfo, evt)}
          options={options}
        />
      }
    }
  ];

  return (
    <div className="project-document-list__container  main-container">
      { documentUpdated ?
        <div className="project-document-update-success">
          <span>document updated successfully</span>
        </div> : null
      }
      <StackableTable
        columns={columns}
        data={documents}
        defaultPageSize={10}
        defaultSorted={[
          {
            id: "createdAt",
            desc: true
          }
        ]}
        getTrProps={(state, rowInfo, column, instance) => {
          return {
            onClick: (e, t) => {
              if (e.target.className.indexOf("Select") === -1)
                history.push(
                  `/s/${rowInfo.original.slug}`
                );
              else {
                console.log({rowInfo})
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
    Component: AdminDocumentList,
    roleRequired: ["admin"]
  })
);
