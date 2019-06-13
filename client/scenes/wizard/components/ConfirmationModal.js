import React, { Fragment } from "react";
import Modal from "react-modal";

export default ({ hideModal, title, message, submit, cancel, errors }) => (
  <Modal
    isOpen={true}
    onRequestClose={hideModal}
    contentLabel="ConfirmationModal"
    className="confirmation-modal"
  >
    <h5>{title}</h5>
    <p>{message}</p>
    {errors && <div>{errors.map(e => <p>{e}</p>)}</div>}
    <div className="d-flex justify-content-end mt-5">
      {cancel && (
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={cancel.handler}
        >
          {cancel.label}
        </button>
      )}
      {submit && (
        <button
          onClick={() => {
            submit.handler();
            hideModal();
          }}
          className="btn btn-primary ml-2"
        >
          {submit.label}
        </button>
      )}
    </div>
  </Modal>
);
