import React from 'react';

import ActionButton from './ActionButton';

type FolderActionsProps = {
  onNewNote: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const FolderActions = ({
  onNewNote = () => null,
  onEdit = () => null,
  onDelete = () => null,
}: FolderActionsProps) => {
  return (
    <ActionButton
      dropdownItems={[
        {
          label: 'New note',
          onClick: onNewNote,
        },
        {
          label: 'Edit',
          onClick: onEdit,
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
  );
};

export default FolderActions;
