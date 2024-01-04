import React from "react";
import "./styles/Modal.css";

const Modal = ({ isOpen, onRequestClose, title, children }) => {
  // isOpen: A prop indicating whether the modal is open.
  // onRequestClose: A prop that passes a callback function to close the modal.
  // title: A prop representing the title of the modal
  // children: Prop representing the content to be displayed inside the modal

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onRequestClose}>
            x
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
