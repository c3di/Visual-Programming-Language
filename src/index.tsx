import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { VPPanel } from './panel';
import { graphInstance } from './MockUpData';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel graphData={graphInstance} />);
