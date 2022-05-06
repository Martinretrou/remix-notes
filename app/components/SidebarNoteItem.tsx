import { useParams } from '@remix-run/react';
import React, { forwardRef } from 'react';
import { Link } from 'remix';
import type { INote } from '~/types/notes';

type Props = {
  title: INote['title'];
  content?: INote['content'];
  id: INote['id'];
  inFolder?: boolean;
};

const SidebarNoteItem = forwardRef(
  ({ title, content, inFolder, id, ...props }: Props, ref) => {
    const params = useParams();

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
        <p className="sidebar-note-item-content">{content}</p>
      </Link>
    );
  }
);

SidebarNoteItem.displayName = 'SidebarNoteItem';

export default SidebarNoteItem;
