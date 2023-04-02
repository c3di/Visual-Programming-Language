import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { VPPanel } from './panel';
import { graphInstance } from './MockUpData';
import { extensionLoad } from './Extension';

extensionLoad();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<VPPanel graphData={graphInstance} />);
