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
  const [activated, setActivated] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setActivated(true);
          setContent(example as SerializedGraph);
        }}
      >
        load example
      </button>
      <button
        onClick={() => {
          setActivated(true);
          setContent(undefined);
        }}
      >
        clear example
      </button>
      <VPEditor
        content={content}
        onContentChange={(content) => {
          console.log(content);
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
