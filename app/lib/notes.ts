import type { INote, INoteFolder } from '~/types/notes';
import { getSupabaseClient } from './supabase';

/*********/
/* NOTES */
/*********/

export const addNote = async (note: INote) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client.from('notes').insert([note]);
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
      .insert([note], { upsert: true });
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

/********************/
/* FOLDERS OF NOTES */
/********************/

export const addFolder = async (folder: INoteFolder) => {
  const client = await getSupabaseClient();
  try {
    const { data, error } = await client.from('folders').insert([folder]);
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
      .insert([folder], { upsert: true });
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
