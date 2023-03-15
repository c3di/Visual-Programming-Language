import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { VPPanel } from './panel';
import { nodes, edges } from './MockUpData';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel initialNodes={nodes} initialEdges={edges} />);
