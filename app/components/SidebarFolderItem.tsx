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
import EditFolderModal from './EditFolderModal';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [displayNoteModal, setDisplayNoteModal] = useState(false);

    resetServerContext();

    useEffect(() => {
      setItemList(notes);
    }, [notes]);

    const handleDrop = (droppedItem: any) => {
      if (!droppedItem.destination) return;
      var updatedList = [...itemList];
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
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

    const handleEditFolder = async (folder: INoteFolder) => {
      setShowEditModal(false);
      const promise = updateFolder(folder);
      toast.promise(promise, {
        loading: 'Updating folder....',
        success: (data) => {
          return 'Successfully updated the folder !';
        },
        error: 'Error updating folder. Try again.',
      });
    };

    const handleNewNote = async () => {
      setDisplayNoteModal(false);
      try {
        const addedNote = await addNote({
          title: 'Untitled',
          user_id: user?.id,
        });

        const nextNotes = [];
        if (folder.notes) {
          nextNotes.push(...folder.notes);
        }
        nextNotes.push(String(addedNote?.[0]?.id));

        await updateFolder({
          ...folder,
          notes: nextNotes,
        });
        await fetchNotes(user?.id);
        await fetchFolders(user?.id);
        navigate(`/notes/${addedNote?.[0]?.id}/edit`);
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
            onNewNote={handleNewNote}
            onDelete={() => setShowDeleteModal(true)}
            onEdit={() => setShowEditModal(true)}
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
        />
        <EditFolderModal
          open={showEditModal}
          folder={folder}
          title="Edit folder"
          onCancel={() => setShowEditModal(false)}
          onConfirm={handleEditFolder}
        />

        <Toaster />
      </div>
    );
  }
);

SidebarFolderItem.displayName = 'SidebarFolderItem';

export default SidebarFolderItem;
