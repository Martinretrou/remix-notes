import type { LoaderFunction } from 'remix';
import { redirect, useLoaderData, useCatch } from 'remix';
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/supabase.server';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import AppLayout from '~/components/AppLayout';
import { getSupabaseClient } from '~/lib/supabase';
import { fetchFolders, fetchNotes } from '~/lib/notes';
import type { INote, INoteFolder } from '~/types/notes';

export let loader: LoaderFunction = async ({ request }) => {
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

  return { notes, folders, user, notesError, error };
};

export default function Dashboard() {
  const { notes, folders, user } = useLoaderData<{
    notes: INote[];
    folders: INoteFolder[];
    user?: User;
  }>();

  const addNote = async () => {
    const client = await getSupabaseClient();
    await client.from('notes').insert([
      {
        title: 'Test note #5',
        content: `<h1>Test title!</h1>
        <p><code>Lorem ipsum dolor sit amet</code></p>`,
        user_id: user?.id,
        cover: null,
      },
    ]);
    fetchNotes(user?.id);
  };

  const addFolder = async () => {
    const client = await getSupabaseClient();
    await client.from('folders').insert([
      {
        id: '2',
        title: 'test folder #2',
        user_id: user?.id,
        notes: ['5', '7'],
      },
    ]);
    fetchFolders(user?.id);
  };

  return (
    <AppLayout user={user} notes={notes} folders={folders}>
      <button type="button" onClick={() => addNote()}>
        Add basic notes
      </button>
      <button type="button" onClick={() => addFolder()}>
        Add basic folder
      </button>
    </AppLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return <AppLayout user={undefined} notes={[]}></AppLayout>;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>There was an error</h1>
      <p>{error.message}</p>
      <hr />
      <p>
        Hey, developer, you should replace this with what you want your users to
        see.
      </p>
    </div>
  );
}
