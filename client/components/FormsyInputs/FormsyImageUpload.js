import { withFormsy } from "formsy-react";
import { connect } from "react-redux";
import React from "react";
import autoBind from "react-autobind";
import { isEmpty } from "lodash";
import { loadModal, hideModal } from "../../data/reducer";

class FormsyImageUpload extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      src: null,
      crop: {
        aspect: 1,
        width: 50,
        x: 0,
        y: 0
      }
    };
  }

  changeValue(e) {
    let file;
    const { loadModal, hideModal } = this.props;
    const fullPath = e.currentTarget.value;
    this.props.setValue(fullPath, false);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      file = e.target.files[0];
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result, file, fullPath })
      );
      reader.readAsDataURL(file);
    }
  }

  upload() {
    this.props.upload(this.state.croppedImageBlob, this.state.fullPath);
    this.setState({
      file: null,
      src: null,
      crop: {
        aspect: 1,
        width: 50,
        height: 50,
        x: 0,
        y: 0
      }
    });
    this.props.hideModal();
  }

  cancelImageSelection() {
    this.setState({
      file: null,
      src: null,
      crop: {
        aspect: 1,
        width: 50,
        x: 0,
        y: 0
      }
    });
    this.props.setValue(null, false);
    this.props.hideModal();
  }

  validateValue(event) {
    this.props.setValue(event.currentTarget.value);
  }

  onImageLoaded(image, pixelCrop) {
    this.imageRef = image;
    this.makeClientCrop(this.state.crop, pixelCrop);
  }

  onCropComplete(crop, pixelCrop) {
    this.makeClientCrop(crop, pixelCrop);
  }

  onCropChange(crop) {
    this.setState({ crop });
  }

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageBlob = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageBlob });
    }
  }

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(blob);
      }, "image/jpeg");
    });
  }

  render() {

    // An error message is returned only if the component is invalid
    const errorMessage = this.props.getErrorMessage(),
      isPristine = this.props.isPristine(),
      isValid = this.props.isValid(),
      showRequired = this.props.showRequired(),
      showError = _.isBoolean(this.props.showError)
        ? this.props.showError
        : this.props.showError(),
      showRequiredMessage = !isPristine && !isValid && showRequired;

    if (this.state.file)
      this.props.loadModal("CROP_IMAGE_MODAL", {
        handleCancel: this.cancelImageSelection,
        handleSubmit: this.upload,
        src: this.state.src,
        crop: this.state.crop,
        onImageLoaded: this.onImageLoaded,
        onCropComplete: this.onCropComplete,
        onCropChange: this.onCropChange,
        croppedImageBlob: this.state.croppedImageBlob,
        imageRef: this.imageRef
      });

    return (
      <div style={{ margin: 0, width: "100%" }}>
        {/*<input*/}
          {/*onChange={this.changeValue}*/}
          {/*onBlur={this.validateValue}*/}
          {/*type="file"*/}
          {/*className={`form-control ${showRequiredMessage &&*/}
            {/*"form-control--invalid"} ${this.props.inputClassname}`}*/}
          {/*value={this.props.getValue() || ""}*/}
        {/*/>*/}
        {!isEmpty(this.props.message) && (
          <div
            className={`text-${this.props.message.status} mr-2`}
            style={{ fontSize: "12px" }}
          >
            {this.props.message.text}
          </div>
        )}
        {/*{showRequiredMessage && (*/}
          {/*<div className="text-danger mr-2" style={{ fontSize: "12px" }}>*/}
            {/*This is required*/}
          {/*</div>*/}
        {/*)}*/}
        {/*{errorMessage && (*/}
          {/*<div className="text-danger mr-2" style={{ fontSize: "12px" }}>*/}
            {/*{errorMessage}*/}
          {/*</div>*/}
        {/*)}*/}
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  return { ...ownProps };
};

const actions = {
  loadModal,
  hideModal
};

export default connect(
  mapState,
  actions
)(withFormsy(FormsyImageUpload));
