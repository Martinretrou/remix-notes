import { useParams } from '@remix-run/react';
import React, { forwardRef, useState } from 'react';
import { Link } from 'remix';
import { deleteNote } from '~/lib/notes';
import type { INote } from '~/types/notes';
import DeleteModal from './DeleteModal';
import NoteActions from './NoteActions';
import toast, { Toaster } from 'react-hot-toast';

type Props = {
  title: INote['title'];
  content?: INote['content'];
  id: INote['id'];
  inFolder?: boolean;
};

const SidebarNoteItem = forwardRef(
  ({ title, content, inFolder, id, ...props }: Props, ref) => {
    const params = useParams();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteNote = async () => {
      setShowDeleteModal(false);
      const promise = deleteNote(id);
      toast.promise(promise, {
        loading: 'Deleting note....',
        success: (data) => {
          return 'Successfully deleted the note !';
        },
        error: 'Error deleting note. Try again.',
      });
    };

    return (
      <Link
        ref={ref}
        {...props}
        className={`sidebar-note-item ${inFolder ? 'in-folder' : ''} ${
          params?.id === String(id) ? 'active' : ''
        }`}
        to={`/notes/${id}/edit`}
      >
        <p className="sidebar-note-item-title">{title}</p>
        <NoteActions
          onDelete={() => setShowDeleteModal(true)}
          onEdit={() => null}
          onMoveToFolder={() => null}
        />
        <DeleteModal
          open={showDeleteModal}
          title="Confirm note deletion"
          description="Deleting a note means losing this note forever. The deletion is irreversible."
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDeleteNote}
        />
        <Toaster />
      </Link>
    );
  }
);

SidebarNoteItem.displayName = 'SidebarNoteItem';

export default SidebarNoteItem;
