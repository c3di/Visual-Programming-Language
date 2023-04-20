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
  return (
    <>
      <button
        onClick={() => {
          setContent(example as SerializedGraph);
        }}
      >
        load example
      </button>
      <VPEditor graph={content} />
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<MainArea />);
