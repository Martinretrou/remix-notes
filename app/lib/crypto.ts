import AES from 'crypto-js/aes';

import CryptoJS from 'crypto-js';
import type { INote, INoteFolder } from '../types/notes';

export const encryptString = (string: string, passphrase: string) => {
  return AES.encrypt(string, passphrase);
};

export const decryptString = (encrypted: string, passphrase: string) => {
  return AES.decrypt(encrypted, passphrase);
};

/*********/
/* NOTES */
/*********/

export const encryptNote = (note: INote, passphrase: string) => {
  return {
    ...note,
    title: encryptString(note?.title, passphrase).toString(),
    content: encryptString(note?.content, passphrase).toString(),
    cover: encryptString(note?.cover, passphrase).toString(),
  };
};

export const decryptNote = (note: Partial<INote>, passphrase: string) => {
  return {
    ...note,
    title: decryptString(note?.title, passphrase).toString(CryptoJS.enc.Utf8),
    content: decryptString(note?.content, passphrase).toString(
      CryptoJS.enc.Utf8
    ),
    cover: decryptString(note?.cover, passphrase).toString(CryptoJS.enc.Utf8),
  };
};

/********************/
/* FOLDERS OF NOTES */
/********************/

export const encryptFolder = (folder: INoteFolder, passphrase: string) => {
  return {
    ...folder,
    title: encryptString(folder?.title, passphrase).toString(),
    description: encryptString(folder?.description, passphrase).toString(),
  };
};

export const decryptFolder = (
  folder: Partial<INoteFolder>,
  passphrase: string
) => {
  return {
    ...folder,
    title: decryptString(folder?.title, passphrase).toString(CryptoJS.enc.Utf8),
    description: decryptString(folder?.description, passphrase).toString(
      CryptoJS.enc.Utf8
    ),
  };
};
