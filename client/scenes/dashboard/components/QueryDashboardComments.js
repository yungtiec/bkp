import React, { Fragment } from "react";
import { range } from "lodash";
import { ArticleStyleLoader } from "../../../components";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loadable from "react-loadable";
import { fetchCommentsWithResponse } from "../data/actions";
import { getComments } from "../data/reducer";
import DashboardComments from "./DashboardComments";

class QueryDashboardComments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCommentsWithResponse();
  }

  render() {
    if (this.props.commentsLoading)
      return (
        <div style={{flex: 1}}>
          {range(5).map(rand => (
            <ArticleStyleLoader
              hideImg={true}
              mobile={this.props.screenWidth < 768}
            />
          ))}
        </div>
      );
    else return <DashboardComments {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const {
    commentsById,
    commentIds,
    commentOffset,
    commentLimit,
    commentEndOfResult,
    additionalCommentsLoading,
    commentsLoading
  } = getComments(state);
  return {
    ...ownProps,
    commentsById,
    commentIds,
    commentOffset,
    commentLimit,
    commentEndOfResult,
    additionalCommentsLoading,
    commentsLoading,
    screenWidth: state.data.environment.width
  };
};

const actions = {
  fetchCommentsWithResponse
};

export default withRouter(
  connect(
    mapState,
    actions
  )(QueryDashboardComments)
);
