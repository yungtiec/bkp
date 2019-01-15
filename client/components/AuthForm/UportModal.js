import React from "react";
import Modal from "react-modal";
import { hideModal, updateModalProps } from "../../data/reducer";

export const UportModal = ({ uri, qrurl, mobileUrl }) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="Uport modal"
  >
    <div>
      <img src={qrurl} />
    </div>
    <div>
      <a href={mobileUrl}>Click here if on mobile</a>
    </div>
  </Modal>
);
