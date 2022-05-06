import React from 'react';

import ActionButton from './ActionButton';

type NoteActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onMoveToFolder: () => void;
};

const NoteActions = ({
  onEdit,
  onDelete,
  onMoveToFolder,
}: NoteActionsProps) => {
  return (
    <div className="note-actions">
      <ActionButton
        dropdownItems={[
          {
            label: 'Edit',
            onClick: onEdit,
          },
          {
            label: 'Move to folder',
            onClick: onMoveToFolder,
          },
          {
            label: 'Delete',
            type: 'delete',
            onClick: onDelete,
          },
        ]}
        iconName="more"
        iconPosition="left"
      />
    </div>
  );
};

export default NoteActions;
