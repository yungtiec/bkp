import React from "react";
import HeroDocument from "./HeroDocument";

export default class HeroHeadline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  navigate(direction) {
    var newIndex =
      this.state.index + direction >= 0
        ? (this.state.index + direction) % this.props.featureDocumentIds.length
        : this.props.featureDocumentIds.length - 1;
    this.setState({
      index: newIndex
    });
  }

  render() {
    const { documentsById, featureDocumentIds } = this.props;

    return (
      <div className="feed__features d-flex ">
        <div className="feed__feature-img-wrap">
          <img
            className="feed__feature-img"
            src={
              documentsById[featureDocumentIds[this.state.index]]
                .header_img_url ||
              "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=2492&q=80"
            }
          />
        </div>
        <div className="feed__feature-articles-container ml-5 d-flex align-items-baseline flex-column">
          <div className="feed__feature-articles-navigation w-100 d-flex justify-content-between align-items-baseline">
            <div className="feed__sections-index">
              <span className="feed__sections-index-current">
                <span className="feed__sections-index-inner">
                  0{this.state.index + 1}
                </span>
              </span>
              <span className="feed__sections-index-total">
                {featureDocumentIds.length < 10
                  ? `0${featureDocumentIds.length}`
                  : featureDocumentIds.length}
              </span>
            </div>
            <div className="feed__feature-articles-nav-btns">
              <a
                className="feed__feature-articles-nav-btn"
                onClick={() => this.navigate(-1)}
              >
                <i className="fas fa-caret-left" />
              </a>
              <a className="feed__feature-articles-nav-btn">
                <i
                  className="fas fa-caret-right"
                  onClick={() => this.navigate(1)}
                />
              </a>
            </div>
          </div>
          <HeroDocument
            document={documentsById[featureDocumentIds[this.state.index]]}
          />
        </div>
      </div>
    );
  }
}
