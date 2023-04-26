import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import libraryExample from './VPLibraryExample.json';
import { VPEditor, LoadLibrary, type SerializedGraph } from './editor';
import './index.css';
import { deepCopy } from './editor/util';

LoadLibrary(libraryExample);

function MainArea({ id }: { id: string }): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(
    undefined
  );
  const [changedCount, setChangedCount] = useState<number>(0);
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
      <textarea value={JSON.stringify(changedCount)} />
      <VPEditor
        id={id}
        content={content}
        onContentChange={(content) => {
          setChangedCount((count) => count + 1);
        }}
        activated={activated}
      />
    </>
  );
}

function App(): JSX.Element {
  return (
    <>
      <MainArea id={'b1'} />
      <MainArea id={'b2'} />
    </>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
