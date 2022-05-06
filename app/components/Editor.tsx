import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTransition } from 'remix';
import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';
import { updateNote } from '~/lib/notes';
import type { INote } from '~/types/notes';
import debounce from 'lodash.debounce';

type EditorProps = {
  note: INote;
};

const mdParser = new MarkdownIt(/* Markdown-it options */);

const Editor = ({ note }: EditorProps) => {
  const ref = useRef(null);
  const [value, setValue] = useState(note?.content || '');
  const [title, setTitle] = useState(note?.title || '');

  const transition = useTransition();

  const handleEditorChange = ({ html, text }) => {
    const newValue = text.replace(/\d/g, '');
    handleNoteUpdate();
    setValue(newValue);
  };

  const handleNoteUpdate = async () => {
    try {
      const data = await updateNote({ ...note, content: value });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setValue(note?.content);
    setTitle(note?.title);
  }, [note]);

  const debouncedChangeHandler = useCallback(
    debounce(handleEditorChange, 300),
    []
  );

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          type="text"
          placeholder="Give your note a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="editor-tool">
        <MdEditor
          ref={ref}
          defaultValue={value || ''}
          value={value || ''}
          renderHTML={(text) => mdParser.render(text)}
          onChange={debouncedChangeHandler}
        />
      </div>
    </div>
  );
};

export default Editor;
