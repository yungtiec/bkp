import React, { Component } from "react";
import autoBind from "react-autobind";
import Modal from "react-modal";
import axios from 'axios';
import './ImageFinder.css';
import ImgList from './Components/ImgList';
import SearchForm from './Components/SearchForm';

class ImageFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    autoBind(this);
  }

  componentDidMount() {
    this.performSearch();
  }

  performSearch = (query = 'blockchain') => {
    const unsplashUrl = `/api/unsplash?query=${query}`;
    axios
      .get(
        unsplashUrl
      )
      .then(data => {
        this.setState({ imgs: data.data.results, loadingState: false });
      })
      .catch(err => {
        console.log('Error happened during fetching!', err);
      });
  };

  render() {
    return (
      <Modal
        isOpen={true}
        contentLabel="ImageFinderModal"
        className="image-finder-modal"
      >
        <div>
          <div className="main-header">
            <div className="inner">
              <SearchForm onSearch={this.performSearch} />
            </div>
          </div>
          <div className="main-content">
            {this.state.loadingState
              ? <p>Loading</p>
              : <ImgList handleImageSelection={this.props.handleImageSelection} data={this.state.imgs} />}
          </div>
        </div>
        <div className="image-finder-image__btns mt-4">
          <button className="btn btn-outline-danger image-finder-image__btn" onClick={() => this.props.hideModal()}>
            Cancel
          </button>
        </div>
      </Modal>
    )
  }
}

export default ImageFinder;
