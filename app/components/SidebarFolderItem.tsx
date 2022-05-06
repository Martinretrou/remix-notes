import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import type { INote, INoteFolder } from '~/types/notes';
import { resetServerContext } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import map from 'lodash.map';
import SidebarNoteItem from './SidebarNoteItem';
import { useParams } from '@remix-run/react';
import Icon from './Icon';

export type SidebarFolderItemProps = {
  folder: INoteFolder;
  notes: INote[];
};

const SidebarFolderItem = forwardRef(
  ({ notes, folder, ...props }: SidebarFolderItemProps, ref) => {
    const params = useParams();
    const [itemList, setItemList] = useState(notes);
    const [isOpened, setIsOpened] = useState(false);
    resetServerContext();

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

    const isActive = useMemo(() => {
      return folder?.notes.includes(params?.id || '');
    }, [folder, params]);

    useEffect(() => {
      if (isActive) setIsOpened(true);
    }, [isActive]);

    return (
      <div
        className={`sidebar-folder-item ${isActive ? 'active' : ''}`}
        ref={ref as any}
        {...props}
      >
        <div
          className="sidebar-folder-item-header"
          onClick={() => setIsOpened(!isOpened)}
        >
          {!isOpened && <Icon iconName="arrow-down-s" />}
          {isOpened && <Icon iconName="arrow-up-s" />}
          <p className="sidebar-folder-item-title">{folder.title}</p>
        </div>

        {isOpened && (
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="list-container">
              {(provided) => (
                <div
                  className="list-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {map(itemList, (note: INote, index) => (
                    <Draggable
                      key={note.id}
                      draggableId={String(note.id)}
                      index={index}
                    >
                      {(provided) => (
                        <SidebarNoteItem
                          key={note.id}
                          ref={provided.innerRef}
                          inFolder
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
    );
  }
);

SidebarFolderItem.displayName = 'SidebarFolderItem';

export default SidebarFolderItem;
