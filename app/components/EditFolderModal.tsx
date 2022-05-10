import React, { useState } from 'react';

import { Modal } from 'react-responsive-modal';
import type { INoteFolder } from '~/types/notes';

type EditFolderModalProps = {
  open: boolean;
  folder: INoteFolder;
  title: string;
  description?: string;
  onConfirm: (folder: Partial<INoteFolder>) => void;
  onCancel: () => void;
};

const EditFolderModal = ({
  open,
  folder,
  title,
  description,
  onCancel,
  onConfirm,
}: EditFolderModalProps) => {
  const [folderTitle, setFolderTitle] = useState(folder?.title || '');
  return (
    <Modal open={open} onClose={onCancel} center>
      <h2 className="modal-title">{title}</h2>
      {description && <p className="modal-description">{description}</p>}
      <form className="modal-form">
        <div className="input-container">
          <label className="" htmlFor="name">
            Folder name
          </label>
          <input
            id="name"
            className=""
            name="name"
            type="text"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            required
            placeholder="New folder"
          />
        </div>
      </form>
      <div className="modal-buttons">
        <button className="alt" onClick={onCancel}>
          Cancel
        </button>
        <button
          onClick={() =>
            onConfirm({
              ...folder,
              title: folderTitle,
            })
          }
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditFolderModal;
