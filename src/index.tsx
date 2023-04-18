import React from 'react';
import ReactDOM from 'react-dom/client';
import graphExample from './VPFileExample.json';
import libraryExample from './VPLibraryExample.json';
import { VPPanel, LoadLibrary } from './panel';
import { type SerializedGraph } from './panel';
import './index.css';

LoadLibrary(libraryExample);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel graph={graphExample as SerializedGraph} />);
