import type { User } from '@supabase/supabase-js';
import debounce from 'lodash.debounce';

import React, { useCallback, useEffect, useMemo } from 'react';
import type { LoaderFunction, MetaFunction } from 'remix';
import { useFetcher } from 'remix';
import { useLocation } from 'remix';
import { redirect, useLoaderData } from 'remix';
import AppLayout from '~/components/AppLayout';
import Editor from '~/components/Editor';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { decryptNote, encryptNote } from '~/lib/crypto';
import { updateNote } from '~/lib/notes';
import { supabase } from '~/lib/supabase/supabase.server';
import type { INote, INoteFolder } from '~/types/notes';

const passphrase = 'lorem-ipsum-dolor-sit-amet';

export let loader: LoaderFunction = async ({ request, params }) => {
  if (!(await isAuthenticated(request))) return redirect('/auth');
  const { user } = await getUserByRequestToken(request);

  const { data: folders, error } = await supabase
    .from('folders')
    .select()
    .eq('user_id', user.id);

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select()
    .eq('user_id', user.id);
  const note = notes?.find((note) => String(note.id) === String(params.id));

  return { folders, user, notesError, error, note, notes };
};

export let meta: MetaFunction = () => {
  return {
    title: 'Edit note | Remix notes',
    description: 'Edit note | Remix notes',
  };
};

const NoteEdit = () => {
  const { folders, note, notes, user } = useLoaderData<{
    folders: INoteFolder[];
    notes: INote[];
    note: INote;
    user?: User;
  }>();

  const fetcher = useFetcher();

  let location = useLocation();

  const currentNote = useMemo(() => note, [note]);

  const handleNoteChange = async (note: INote) => {
    try {
      await updateNote(note);
      const encrypted = encryptNote(note, passphrase);
      const decrypted = decryptNote(encrypted, passphrase);
      fetcher.load(location.pathname);
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedNoteUpdate = useCallback(debounce(handleNoteChange, 1000), []);

  useEffect(() => {
    debouncedNoteUpdate.cancel();
    () => {
      return debouncedNoteUpdate.cancel();
    };
  }, [location.key]);

  useEffect(() => {
    () => {
      return debouncedNoteUpdate.cancel();
    };
  }, []);

  console.log({ note });

  return (
    <AppLayout user={user} folders={folders} notes={notes}>
      {currentNote && (
        <Editor onNoteChange={debouncedNoteUpdate} note={currentNote} />
      )}
    </AppLayout>
  );
};

export default NoteEdit;
