import React, { useEffect, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';
import type { INote } from '~/types/notes';
import { decryptNote } from '~/lib/crypto';
import markdownItAnchor from 'markdown-it-anchor';

var taskLists = require('markdown-it-task-lists');
var linkify = require('linkify-it')();
var externalLinks = require('markdown-it-external-links');

linkify.set({ fuzzyEmail: false });

type EditorProps = {
  note: INote;
  onNoteChange: (note: INote) => void;
};

const mdParser = MarkdownIt({
  linkify: true,
})
  .use(taskLists, { label: true })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '', // §
  })
  .use(externalLinks);

const Editor = ({ note, onNoteChange }: EditorProps) => {
  const ref = useRef(null);
  const [value, setValue] = useState(note?.content || '');
  const [title, setTitle] = useState(note?.title || '');

  const handleEditorChange = async ({ html, text }) => {
    const newValue = text.replace(/\d/g, '');
    onNoteChange({ ...note, title, content: newValue });
    setValue(text);
  };

  const handleTitleChange = async (title: string) => {
    const newValue = title.replace(/\d/g, '');
    onNoteChange({ ...note, title: newValue, content: value });
    setTitle(newValue);
  };

  useEffect(() => {
    const nextNote = decryptNote(note, passphrase);
    setTitle(nextNote?.title);
    setValue(nextNote?.content || '');
  }, [note]);

  function onImageUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          type="text"
          placeholder="Give your note a title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
        <div className="editor-header-meta">
          <p>last updated: {note?.updated_at}</p>
        </div>
      </div>
      <div className="editor-tool">
        <MdEditor
          ref={ref}
          defaultValue={value || ''}
          value={value || ''}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          onImageUpload={onImageUpload}
        />
      </div>
    </div>
  );
};

export default Editor;
