import "./StackableTable.scss";
import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import createTable from "react-table-hoc-fixed-columns";
const ReactTableFixedColumns = createTable(ReactTable);

export default props => (
  <ReactTableFixedColumns
    data={props.data}
    columns={props.columns}
    defaultPageSize={props.defaultPageSize}
    defaultSorted={props.defaultSorted}
    getTrProps={props.getTrProps}
  />
);
