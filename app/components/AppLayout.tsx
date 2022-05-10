import type { PropsWithChildren, ReactElement } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import Header from './Header';
import Sidebar from './Sidebar';
import type { INote, INoteFolder } from '~/types/notes';
import { decryptFolder, decryptNote } from '~/lib/crypto';
import DecryptModal from './DecryptModal';

type AppLayoutProps = {
  user?: User;
  notes: INote[];
  folders: INoteFolder[];
};

function AppLayout({
  user,
  notes,
  folders,
  children,
}: PropsWithChildren<AppLayoutProps>): ReactElement {
  const [passphrase, setPassphrase] = useState<string>('');
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const decryptedNotes = useMemo(() => {
    return passphrase
      ? notes.map((note) => decryptNote(note, passphrase))
      : notes;
  }, [notes, passphrase]);

  const decryptedFolders = useMemo(() => {
    return passphrase
      ? folders.map((folder) => decryptFolder(folder, passphrase))
      : folders;
  }, [folders, passphrase]);

  useEffect(() => {
    if (!passphrase) setShowDecryptModal(true);
  }, [passphrase]);

  const handlePassphraseChange = (value: string) => {
    setShowDecryptModal(false);
    setPassphrase(value);
  };

  return (
    <>
      <div className={`app-content ${showDecryptModal ? 'blur' : ''}`}>
        <Sidebar
          user={user}
          notes={decryptedNotes}
          folders={decryptedFolders}
        />
        <div className="app-children">
          <Header user={user} />
          {children}
        </div>
      </div>
      <DecryptModal
        open={showDecryptModal}
        title="Decrypt your notes"
        description="Enter your passphrase to decrypt your notes."
        onDecrypt={handlePassphraseChange}
      />
    </>
  );
}

export default AppLayout;
