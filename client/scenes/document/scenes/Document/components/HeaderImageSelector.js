import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

class HeaderImageSelector extends React.Component {

  render() {
    return (
      <div className="mt-2 mb-2">
        Header Image:
        {
          this.props.headerImageUrl ?
            <div>
              <img
                onClick={() => this.props.openImageFinderModal()}
                className="header-image-selector"
                src={this.props.headerImageUrl}/>
            </div> :
            <div>
              <button className="mt-2" onClick={() => this.props.openImageFinderModal()}>Add Image</button>
            </div>
        }
      </div>
    )
  }
}

const mapState = state => {

  return {};
};

const actions = {};

export default withRouter(connect(mapState, actions)(HeaderImageSelector));