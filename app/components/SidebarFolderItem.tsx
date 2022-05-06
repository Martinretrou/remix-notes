import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import type { INote, INoteFolder } from '~/types/notes';
import { resetServerContext } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import map from 'lodash.map';
import SidebarNoteItem from './SidebarNoteItem';
import { useNavigate, useParams } from '@remix-run/react';
import Icon from './Icon';
import FolderActions from './FolderActions';
import DeleteModal from './DeleteModal';
import {
  addNote,
  deleteFolder,
  fetchFolders,
  fetchNotes,
  updateFolder,
} from '~/lib/notes';
import toast, { Toaster } from 'react-hot-toast';
import AddNoteModal from './AddNoteModal';
import type { User } from '@supabase/supabase-js';

export type SidebarFolderItemProps = {
  folder: INoteFolder;
  notes: INote[];
  user?: User;
};

const SidebarFolderItem = forwardRef(
  ({ notes, folder, user, ...props }: SidebarFolderItemProps, ref) => {
    const params = useParams();
    let navigate = useNavigate();

    const [itemList, setItemList] = useState(notes);
    const [isOpened, setIsOpened] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [displayNoteModal, setDisplayNoteModal] = useState(false);

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
      return folder?.notes?.includes(params?.id || '');
    }, [folder, params]);

    useEffect(() => {
      if (isActive) setIsOpened(true);
    }, [isActive]);

    const handleDeleteFolder = async () => {
      setShowDeleteModal(false);
      const promise = deleteFolder(folder.id);
      toast.promise(promise, {
        loading: 'Deleting folder....',
        success: (data) => {
          return 'Successfully deleted the folder !';
        },
        error: 'Error deleting folder. Try again.',
      });
    };

    const handleNewNote = async () => {
      setDisplayNoteModal(false);
      try {
        const promise = addNote({
          title: 'Untitled',
          user_id: user?.id,
        });

        toast.promise(promise, {
          loading: 'Creating note....',
          success: (data) => {
            navigate(`/notes/${data?.[0]?.id}/edit`);

            return 'Successfully created a new note!';
          },
          error: 'Error creating note. Try again.',
        });

        const data = Promise.resolve(promise);

        data.then(async (value) => {
          console.log(value);
          await updateFolder({
            ...folder,
            notes: [...folder?.notes, String(value?.[0]?.id)],
          });
          await fetchNotes(user?.id);
          // await fetchFolders(user?.id);
        });
      } catch (err) {
        console.error(err);
      }
    };

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
          <div className="left">
            {!isOpened && <Icon iconName="arrow-down-s" />}
            {isOpened && <Icon iconName="arrow-up-s" />}
            <p className="sidebar-folder-item-title">{folder.title}</p>
          </div>
          <FolderActions
            onNewNote={() => setDisplayNoteModal(true)}
            onDelete={() => setShowDeleteModal(true)}
            onEdit={() => null}
          />
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
        <AddNoteModal
          open={displayNoteModal}
          onCancel={() => setDisplayNoteModal(false)}
          onConfirm={handleNewNote}
          title="Create new note in the folder"
        />
        <DeleteModal
          open={showDeleteModal}
          title="Confirm folder deletion"
          description="Deleting a folder means deleting the folder and the notes containd in the folder. The deletion is irreversible."
          onCancel={() => setShowDeleteModal(false)}
          onDelete={handleDeleteFolder}
          setDisplayNoteModal(false);
        />
        <Toaster />
      </div>
    );
  }
);

SidebarFolderItem.displayName = 'SidebarFolderItem';

export default SidebarFolderItem;
