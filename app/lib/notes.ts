import type { INote, INoteFolder } from '~/types/notes';
import { encryptFolder, encryptNote } from './crypto';
import { getSupabaseClient } from './supabase';

const passphrase = 'lorem-ipsum-dolor-sit-amet';

/*********/
/* NOTES */
/*********/

export const addNote = async (note: INote) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('notes')
      .insert([encryptNote(note, passphrase)]);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const updateNote = async (note: INote) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('notes')
      .insert(
        [
          encryptNote(
            { ...note, updated_at: new Date().toISOString() },
            passphrase
          ),
        ],
        {
          upsert: true,
        }
      );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchNotes = async (userId: string) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('notes')
      .select()
      .eq('user_id', userId);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteNote = async (id: string) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client.from('notes').delete().match({ id });
    return data;
  } catch (err) {
    console.error(err);
  }
};

/********************/
/* FOLDERS OF NOTES */
/********************/

export const addFolder = async (folder: INoteFolder) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('folders')
      .insert([encryptFolder(folder, passphrase)]);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const updateFolder = async (folder: INoteFolder) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('folders')
      .insert(
        [
          encryptFolder(
            { ...folder, updated_at: new Date().toISOString() },
            passphrase
          ),
        ],
        {
          upsert: true,
        }
      );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchFolders = async (userId: string) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client
      .from('folders')
      .select()
      .eq('user_id', userId);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteFolder = async (id: string) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client.from('folders').delete().match({ id });
    return data;
  } catch (err) {
    console.error(err);
  }
};
