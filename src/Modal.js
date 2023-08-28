import React from "react";
import "./styles/Modal.css";

const Modal = ({ isOpen, onRequestClose, title, children }) => {
  // isOpen: 모달이 열려있는지 여부를 나타내는 prop
  // onRequestClose: 모달을 닫기 위한 콜백 함수를 전달하는 prop
  // title: 모달의 제목을 나타내는 prop
  // children: 모달 내부에 표시될 컨텐츠를 나타내는 prop

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
