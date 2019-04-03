import React from "react";
import { range } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchCommentsById,
  updateCommentFilter,
  clearComments,
  replyToComment,
  upvoteComment,
  editComment
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
import { loadModal, hideModal } from "../../../../../data/reducer";
import { notify } from "reapop";

class QueryComments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCommentsById(this.props.slug);
  }

  componentWillUnmount() {
    this.props.clearComments();
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
    commentOptionMenus: getFilterOptionMenus(state),
    me: state.data.user
  };
};

const action = {
  fetchCommentsById,
  updateCommentFilter,
  clearComments,
  replyToComment,
  upvoteComment,
  editComment,
  loadModal,
  hideModal,
  notify
};

export default withRouter(
  connect(
    mapState,
    action
  )(QueryComments)
);
