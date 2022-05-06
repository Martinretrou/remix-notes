import type { LoaderFunction } from 'remix';
import { redirect, useLoaderData, useCatch } from 'remix';
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/supabase.server';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import AppLayout from '~/components/AppLayout';
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

  if (notes?.length) {
    return redirect(`/notes/${notes?.[0]?.id}/edit`);
  }

  return { notes, folders, user, notesError, error };
};

export default function Notes() {
  const { notes, folders, user } = useLoaderData<{
    notes: INote[];
    folders: INoteFolder[];
    user?: User;
  }>();

  return <AppLayout user={user} notes={notes} folders={folders}></AppLayout>;
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return <AppLayout user={undefined} folders={[]} notes={[]}></AppLayout>;
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
