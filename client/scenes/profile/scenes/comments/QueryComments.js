import React, { Component } from "react";
import { connect } from "react-redux";
import { batchActions } from "redux-batched-actions";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { SquareLoader } from "halogenium";

// actions - profile/comments
import {
  fetchUserComments,
  updatePageOffset,
  updatePageProjectFilter,
  checkSidebarFilter
} from "./data/actions";

// selectors - profile/comments
import { getUserComments, getPageAndFilter } from "./data/reducer";

// actions - projects
// selectors - projects
import { fetchAllProjects, getAllProjects } from "../../../../data/reducer";

const LoadableUserComments = Loadable({
  loader: () => import("./Comments"),
  loading: () => (
    <SquareLoader
      className="route__loader"
      color="#2d4dd1"
      size="16px"
      margin="4px"
    />
  ),
  render(loaded, props) {
    let UserComments = loaded.default;
    return <UserComments {...props} />;
  },
  delay: 400
});

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const userId = this.props.match.path.split("/")[2];
    batchActions([this.props.fetchComments(), this.props.fetchProjects()]);
  }

  render() {
    if (!this.props.commentIds || !this.props.projectSymbolArr) return null;
    else return <LoadableUserComments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { commentsById, commentIds } = getUserComments(state);
  const { projectsBySymbol, projectSymbolArr } = getAllProjects(state);
  const {
    pageLimit,
    pageOffset,
    pageCount,
    pageProjectFilter,
    pageDocumentFilter,
    checked
  } = getPageAndFilter(state);
  return {
    commentsById,
    commentIds,
    projectsBySymbol,
    projectSymbolArr,
    pageLimit,
    pageOffset,
    pageCount,
    pageProjectFilter,
    pageDocumentFilter,
    checked
  };
};

const mapDispatch = (dispatch, ownProps) => {
  const userId = ownProps.match.path.split("/")[2];
  return {
    fetchComments: () => dispatch(fetchUserComments(userId)),
    fetchProjects: () => dispatch(fetchAllProjects()),
    checkSidebarFilter: checked =>
      dispatch(checkSidebarFilter(userId, checked)),
    updatePageOffset: page => dispatch(updatePageOffset(userId, page.selected)),
    updateProjectFilter: selectedProject =>
      dispatch(updatePageProjectFilter(userId, selectedProject))
  };
};

const actions = {
  fetchUserComments,
  fetchAllProjects,
  updatePageOffset,
  updatePageProjectFilter,
  checkSidebarFilter
};

export default withRouter(connect(mapState, mapDispatch)(MyComponent));
