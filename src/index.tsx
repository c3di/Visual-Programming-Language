import React from 'react';
import ReactDOM from 'react-dom/client';
import graphExample from './VPFileExample.json';
import libraryExample from './VPLibraryExample.json';
import { VPEditor, LoadLibrary, type SerializedGraph } from './Editor';
import './index.css';

LoadLibrary(libraryExample);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPEditor graph={graphExample as SerializedGraph} />);
