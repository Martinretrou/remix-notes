import type { PropsWithChildren, ReactElement } from 'react';
import type { User } from '@supabase/supabase-js';
import Header from './Header';
import Sidebar from './Sidebar';
import type { INote, INoteFolder } from '~/types/notes';

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
  return (
    <div className="app-content">
      <Sidebar user={user} notes={notes} folders={folders} />
      <div className="app-children">
        <Header user={user} />
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
