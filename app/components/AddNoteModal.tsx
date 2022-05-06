import React, { useState } from 'react';

import { Modal } from 'react-responsive-modal';

type AddNoteModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const AddNoteModal = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: AddNoteModalProps) => {
  return (
    <Modal open={open} onClose={onCancel} center>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div className="modal-buttons">
        <button className="alt" onClick={onCancel}>
          Cancel
        </button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
};

export default AddNoteModal;
