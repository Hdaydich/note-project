import React from 'react';

import Modal from './Modal';

import './ErrorModal.css';

function ErrorModal (props) {
  return (
    <Modal
      onCancel={props.onClear}
      header="OUPS! An Error Occurred!"
      show={!!props.error}
    >
      <div>{props.error}</div>
    </Modal>
  );
};

export default ErrorModal;
