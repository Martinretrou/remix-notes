import type { PropsWithChildren, ReactElement } from 'react';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useTransition, useNavigate } from 'remix';
import { addNote } from '~/lib/notes';
import Icon from './Icon';
import AddNoteModal from './AddNoteModal';
import toast, { Toaster } from 'react-hot-toast';

type HeaderProps = {
  user?: User;
};

function Header({ user }: PropsWithChildren<HeaderProps>): ReactElement {
  const transition = useTransition();
  let navigate = useNavigate();

  const [displayNoteModal, setDisplayNoteModal] = useState(false);

  const handleNewNote = async () => {
    setDisplayNoteModal(false);
    try {
      const data = await addNote({
        title: 'Untitled',
        user_id: user?.id,
      });
      navigate(`/notes/${data?.[0]?.id}/edit`);
      toast.success('Successfully created a new note!');
    } catch (err) {
      console.error(err);
    }
  };

  console.log({ displayNoteModal });

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
        <div className="header-action">
          <Icon iconName="folder" onClick={() => handleNewNote()} />
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
      <Toaster />
    </nav>
  );
}

export default Header;
