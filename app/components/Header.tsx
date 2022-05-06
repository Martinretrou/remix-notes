import type { PropsWithChildren, ReactElement } from 'react';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useTransition, useNavigate } from 'remix';
import { addFolder, addNote, fetchFolders, fetchNotes } from '~/lib/notes';
import Icon from './Icon';
import AddNoteModal from './AddNoteModal';
import toast, { Toaster } from 'react-hot-toast';
import AddFolderModal from './AddFolderModal';
import type { INoteFolder } from '~/types/notes';

type HeaderProps = {
  user?: User;
};

function Header({ user }: PropsWithChildren<HeaderProps>): ReactElement {
  const transition = useTransition();
  let navigate = useNavigate();

  const [displayNoteModal, setDisplayNoteModal] = useState(false);
  const [displayFolderModal, setDisplayFolderModal] = useState(false);

  const handleNewNote = async () => {
    setDisplayNoteModal(false);
    try {
      const promise = addNote({
        title: 'Untitled',
        user_id: user?.id,
      });

      toast.promise(promise, {
        loading: 'Creating note....',
        success: (data) => {
          navigate(`/notes/${data?.[0]?.id}/edit`);

          return 'Successfully created a new note!';
        },
        error: 'Error creating note. Try again.',
      });

      await fetchNotes(user?.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewFolder = async (folder: Partial<INoteFolder>) => {
    setDisplayFolderModal(false);
    try {
      const promise = addFolder({
        title: folder.title,
        user_id: user?.id,
      });

      toast.promise(promise, {
        loading: 'Creating folder....',
        success: (data) => {
          return 'Successfully created a new folder!';
        },
        error: 'Error creating folder. Try again.',
      });

      await fetchFolders(user?.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="header">
      <div className="header-actions">
        <div
          className="header-action"
          onClick={() => setDisplayNoteModal(true)}
        >
          <Icon iconName="sticky-note-2" />
          <p>New note</p>
        </div>
        <div
          className="header-action"
          onClick={() => setDisplayFolderModal(true)}
        >
          <Icon iconName="folder" />
          <p>New folder</p>
        </div>
      </div>
      <div className="header-meta">
        <p>{user?.email}</p>
        <div className="header-avatar" />
      </div>
      <AddNoteModal
        open={displayNoteModal}
        onCancel={() => setDisplayNoteModal(false)}
        onConfirm={handleNewNote}
        title="Create new note"
      />
      <AddFolderModal
        open={displayFolderModal}
        onCancel={() => setDisplayFolderModal(false)}
        onConfirm={handleNewFolder}
        title="Create new folder"
      />
      <Toaster />
    </nav>
  );
}

export default Header;
