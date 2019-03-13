import React from "react";
import { range } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchCommentsById,
  updateCommentFilter,
  clearCommentFilter
} from "../data/actions";
import {
  getCommentsById,
  getCommentIds,
  getCommentsOffsetAndLimit,
  getCommentsLoadingStatus,
  getFilterOptionMenus,
  getFilters
} from "../data/reducer";
import { ArticleStyleLoader } from "../../../../../components";
import { Comments } from "./index";

class QueryComments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCommentsById(this.props.match.params.slug);
  }

  render() {
    if (this.props.commentsLoading)
      return (
        <div className="app-container">
          {range(5).map(rand => (
            <ArticleStyleLoader
              mobile={this.props.screenWidth < 768}
              hideImg={true}
            />
          ))}
        </div>
      );
    else return <Comments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const {
    commentOffset,
    commentLimit,
    commentEndOfResult
  } = getCommentsOffsetAndLimit(state);

  const {
    additionalCommentsLoading,
    commentsLoading
  } = getCommentsLoadingStatus(state);
  return {
    ...ownProps,
    commentsById: getCommentsById(state),
    commentIds: getCommentIds(state),
    offset: commentOffset,
    limit: commentLimit,
    endOfResult: commentEndOfResult,
    commentsLoading,
    additionalCommentsLoading,
    commentfilters: getFilters(state),
    commentOptionMenus: getFilterOptionMenus(state)
  };
};

const action = {
  fetchCommentsById,
  updateCommentFilter,
  clearCommentFilter
};

export default withRouter(
  connect(
    mapState,
    action
  )(QueryComments)
);
