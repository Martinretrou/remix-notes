import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import map from 'lodash.map';
import { addNote } from '~/lib/notes';
import type { User } from '@supabase/supabase-js';
import { useNavigate } from 'remix';
import { resetServerContext } from 'react-beautiful-dnd';
import type { INote, INoteFolder } from '~/types/notes';
import SidebarFolderItem from './SidebarFolderItem';
import SidebarNoteItem from './SidebarNoteItem';
import Icon from './Icon';

type SidebarProps = {
  folders: INoteFolder[];
  notes: INote[];
  user?: User;
};

const Sidebar = ({ notes, folders, user }: SidebarProps) => {
  const [itemList, setItemList] = useState(folders);
  const [trailingNotesList, setTrailingNotesList] = useState<INote[]>([]);

  let navigate = useNavigate();

  const handleNewNote = async () => {
    try {
      const data = await addNote({
        title: 'Untitled',
        user_id: user?.id,
      });
      navigate(`/notes/${data?.[0]?.id}/edit`);
    } catch (err) {
      console.error(err);
    }
  };

  resetServerContext();

  const handleTrailingNoteDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...trailingNotesList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setTrailingNotesList(updatedList);
  };

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...itemList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemList(updatedList);
  };

  const getNotesByIds = (ids: string[]): INote[] => {
    return notes.filter((note) => ids.includes(String(note.id)));
  };

  const trailingNotes = useMemo(() => {
    const notesIdInFolders = folders
      .map((folder) => folder.notes)
      .flat(Infinity);

    return notes.filter((note) => !notesIdInFolders.includes(String(note.id)));
  }, [folders, notes]);

  useEffect(() => setTrailingNotesList(trailingNotes), [trailingNotes]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          Remix
          <br />
          <mark>notes</mark>
        </h1>
      </div>
      <div className="sidebar-content">
        <h4>
          <Icon iconName="folder" />
          Folders
        </h4>
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {map(itemList, (folder, index) => (
                  <Draggable
                    key={folder.id}
                    draggableId={String(folder.id)}
                    index={index}
                  >
                    {(provided) => (
                      <SidebarFolderItem
                        notes={getNotesByIds(folder.notes)}
                        folder={folder}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <h4>
          <Icon iconName="sticky-note-2" />
          Notes
        </h4>
        <DragDropContext onDragEnd={handleTrailingNoteDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {map(trailingNotesList, (note, index) => (
                  <Draggable
                    key={note.id}
                    draggableId={String(note.id)}
                    index={index}
                  >
                    {(provided) => (
                      <SidebarNoteItem
                        key={note.id}
                        ref={provided.innerRef}
                        {...note}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Sidebar;
