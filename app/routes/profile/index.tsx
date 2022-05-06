import type { LoaderFunction } from 'remix';
import { redirect, useLoaderData, Link, useCatch } from 'remix';
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/supabase.server';
import { isAuthenticated, getUserByRequestToken } from '~/lib/auth';
import AppLayout from '~/components/AppLayout';

type ProfileAttrs = {
  username?: string;
  website?: string;
  avatar_url?: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  if (!(await isAuthenticated(request))) return redirect('/auth');
  const { user } = await getUserByRequestToken(request);
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`username, website, avatar_url`)
    .eq('id', user.id)
    .single();
  if (!profile)
    throw new Response(user.id, {
      status: 404,
    });
  return { profile, user, error };
};

export default function Profile() {
  const { profile, user } = useLoaderData<{
    profile: ProfileAttrs;
    user?: User;
  }>();

  return (
    <AppLayout user={user}>
      <div className="relative flex flex-col items-center justify-center">
        <div className="flex flex-col place-items-center py-8">
          <div>
            {profile?.avatar_url && (
              <div className="mt-2 text-center">
                <div className="flex flex-col items-center gap-3 space-x-6">
                  <div className="shrink-0">
                    <img
                      className="h-36 w-36 rounded-full object-cover shadow-lg"
                      src={`/images/avatars/${profile.avatar_url}`}
                      alt={profile?.username}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="profile-detail my-4 flex flex-col place-items-center">
              <h2 className="mb-1 text-4xl">
                Howdie, {profile?.username || user?.email}!
              </h2>
              {profile?.website && (
                <span className="inline-block rounded-full bg-gray-400 px-2 py-1 text-white">
                  {profile?.website}
                </span>
              )}
              <br />
              <Link
                className="rounded-md bg-indigo-500 px-4 py-1 text-white shadow-lg shadow-indigo-500/50"
                to={`/profile/${user?.id}/edit`}
              >
                Update Profile Details
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 w-3/5 overflow-hidden rounded-md bg-green-800 text-center shadow-2xl shadow-green-500/50">
          <h3 className="px-2 py-1 text-white">User from Supabase</h3>
          <small className="inline-block w-full bg-gray-800 px-4 py-2 text-white">
            {JSON.stringify(user)}
          </small>
        </div>
      </div>
    </AppLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return (
      <AppLayout user={undefined}>
        <div className="relative flex flex-col items-center justify-center"></div>
      </AppLayout>
    );
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
