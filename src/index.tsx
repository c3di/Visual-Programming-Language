import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import libraryExample from './VPLibraryExample.json';
import { VPEditor, LoadLibrary, type SerializedGraph } from './editor';
import './index.css';

LoadLibrary(libraryExample);

function MainArea(): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(
    undefined
  );
  const [cachedContent, setCachedContent] = useState<string>('');
  const [savedContent, setSavedContent] = useState<string>('');
  const [activated, setActivated] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setActivated(true);
          setContent(example as SerializedGraph);
        }}
      >
        load default
      </button>
      <button
        onClick={() => {
          setActivated(false);
          setContent(undefined);
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          setActivated(false);
          setSavedContent(cachedContent);
        }}
      >
        save
      </button>
      <button
        onClick={() => {
          setActivated(false);
          if (savedContent === '') setContent(example as SerializedGraph);
          else setContent(JSON.parse(savedContent));
        }}
      >
        load saved
      </button>
      <VPEditor
        content={content}
        onContentChange={(content) => {
          setCachedContent(content);
        }}
        activated={activated}
      />
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<MainArea />);
