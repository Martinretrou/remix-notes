import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import map from 'lodash.map';
import type { User } from '@supabase/supabase-js';
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

  resetServerContext();

  const handleTrailingNoteDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;
    var updatedList = [...trailingNotesList];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    setTrailingNotesList(updatedList);
  };

  const handleDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;
    var updatedList = [...itemList];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    setItemList(updatedList);
  };

  const getNotesByIds = (ids: string[]): INote[] => {
    return notes.filter((note) => ids?.includes(String(note.id)));
  };

  const trailingNotes = useMemo(() => {
    const notesIdInFolders = folders
      .map((folder) => folder.notes)
      .flat(Infinity);

    return notes
      .filter((note) => !notesIdInFolders?.includes(String(note.id)))
      .sort(function (a, b) {
        return a?.updated_at - b?.updated_at;
      });
  }, [folders, notes]);

  useEffect(() => setTrailingNotesList(trailingNotes), [trailingNotes]);
  useEffect(() => setItemList(folders), [folders]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          Nabu <mark>notes</mark>
        </h1>
      </div>
      <div className="sidebar-content">
        <h4>
          <Icon iconName="folder" />
          Folders
        </h4>
        {!!itemList.length && (
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
                          user={user}
                          notes={getNotesByIds(folder.notes)}
                          folder={folder}
                          key={folder.id}
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
        )}
        <h4>
          <Icon iconName="sticky-note-2" />
          Notes
        </h4>
        {!!trailingNotesList.length && (
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
        )}
      </div>
    </div>
  );
};

export default Sidebar;
