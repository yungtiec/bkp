import React, { Fragment } from "react";
import Modal from "react-modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./CropImageModal.scss";

const CropImageModal = ({
  hideModal,
  handleCancel,
  handleSubmit,
  src,
  crop,
  onImageLoaded,
  onCropComplete,
  onCropChange,
  croppedImageBlob,
  imageRef
}) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="CropImageModal"
    className="crop-image-modal"
  >
    <div className="crop-image__container">
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
        />
      )}
      <div className="crop-image__btns mt-4">
        <button
          className="btn btn-primary mr-2"
          disabled={!imageRef}
          onClick={handleSubmit}
        >
          Upload
        </button>
        <button className="btn btn-outline-danger" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  </Modal>
);

export default CropImageModal;
