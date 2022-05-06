import type { User } from '@supabase/supabase-js';

import React, { useMemo, useState } from 'react';
import type { LoaderFunction } from 'remix';
import { redirect, useLoaderData, useTransition } from 'remix';
import AppLayout from '~/components/AppLayout';
import Editor from '~/components/Editor';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import { supabase } from '~/lib/supabase/supabase.server';
import type { INote, INoteFolder } from '~/types/notes';

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

const NoteEdit = () => {
  const { folders, note, notes, user } = useLoaderData<{
    folders: INoteFolder[];
    notes: INote[];
    note: INote;
    user?: User;
  }>();

  const transition = useTransition();

  const currentNote = useMemo(() => note, [note]);

  return (
    <AppLayout user={user} folders={folders} notes={notes}>
      {currentNote && <Editor note={currentNote} />}
    </AppLayout>
  );
};

export default NoteEdit;
