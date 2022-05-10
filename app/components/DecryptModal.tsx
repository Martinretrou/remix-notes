import React, { useState } from 'react';

import { Modal } from 'react-responsive-modal';

type DecryptModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onDecrypt: (passphrase: string) => void;
};

const DecryptModal = ({
  open,
  title,
  description,
  onDecrypt,
}: DecryptModalProps) => {
  const [passphrase, setPassphrase] = useState('lorem-ipsum-dolor-sit-amet');
  return (
    <Modal open={open} onClose={() => null} center>
      <h2 className="modal-title">{title}</h2>
      {description && <p className="modal-description">{description}</p>}
      <form className="modal-form">
        <div className="input-container">
          <label className="" htmlFor="passphrase">
            Passphrase
          </label>
          <input
            id="passphrase"
            name="passphrase"
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            required
            placeholder="Enter passphrase to decrypt your notes"
          />
        </div>
      </form>
      <div className="modal-buttons">
        <button onClick={() => onDecrypt(passphrase)}>Decrypt</button>
      </div>
    </Modal>
  );
};

export default DecryptModal;
