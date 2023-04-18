import React from 'react';
import ReactDOM from 'react-dom/client';
import mockData from './SerializationExample.json';
import { VPPanel } from './panel';
import { type SerializedGraph } from './panel';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel graph={mockData as SerializedGraph} />);
