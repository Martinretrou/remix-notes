import React, { useState } from 'react';

import { Modal } from 'react-responsive-modal';

type DeleteModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onDelete: () => void;
  onCancel: () => void;
};

const DeleteModal = ({
  open,
  title,
  description,
  onCancel,
  onDelete,
}: DeleteModalProps) => {
  return (
    <Modal open={open} onClose={onCancel} center>
      <h2 className="modal-title">{title}</h2>
      {description && <p className="modal-description">{description}</p>}
      <div className="modal-buttons">
        <button className="alt" onClick={onCancel}>
          Cancel
        </button>
        <button className="danger" onClick={onDelete}>
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
