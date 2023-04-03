import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { VPPanel } from './panel';
import mockData from './SerializationExample.json';
import { extensionLoad } from './Extension';
import { type SerializedGraph } from './panel/types';

extensionLoad();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel graph={mockData as SerializedGraph} />);
