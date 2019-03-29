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
    const hiddenOnXsSmScreenSize = "d-none d-sm-none d-md-block";
    const hiddenOnMdLgXlScreenSize = "d-md-none d-lg-none d-xl-none";
    const currentImage = documentsById[ featureDocumentIds[this.state.index] ];
    const imgUrl = currentImage.header_img_url.includes("unsplash") ?
      currentImage.header_img_url.concat('&auto=format&fit=crop&w=800&q=80') :
      currentImage.header_img_url;

    console.log({imgUrl})
    const backgroundImage = `url(${imgUrl ||
    "https://images.unsplash.com/photo-1547559418-8d7437f53b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}`;
    const backupImgUrl =
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=2492&q=80";

    return (
      <div className="feed__features d-flex ">
        <div className={`feed__feature-img-wrap ${hiddenOnXsSmScreenSize}`}>
          <a
            className="feed__feature-img"
            style={{
              backgroundImage: `url(${imgUrl || backupImgUrl})`
            }}
          />
        </div>
        <div className="feed__feature-articles-container d-flex align-items-baseline flex-column">
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
