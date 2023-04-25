import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import libraryExample from './VPLibraryExample.json';
import { VPEditor, LoadLibrary, type SerializedGraph } from './editor';
import './index.css';
import { deepCopy } from './editor/util';

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
          setContent(deepCopy(example) as SerializedGraph);
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
