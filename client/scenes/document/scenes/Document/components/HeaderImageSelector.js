import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class HeaderImageSelector extends React.Component {
  render() {
    const imgUrl = this.props.headerImageUrl && this.props.headerImageUrl.includes("unsplash") ?
      this.props.headerImageUrl.concat('&auto=format&fit=crop&w=800&q=10') :
      this.props.headerImageUrl;

    return this.props.headerImageUrl ? (
      <div>
        <img
          onClick={() => this.props.openImageFinderModal()}
          className="header-image-selector"
          src={imgUrl}
        />
      </div>
    ) : (
      <div>
        <button
          className="mt-2"
          onClick={() => this.props.openImageFinderModal()}
        >
          Add Image
        </button>
      </div>
    );
  }
}

const mapState = state => {
  return {};
};

const actions = {};

export default withRouter(
  connect(
    mapState,
    actions
  )(HeaderImageSelector)
);
