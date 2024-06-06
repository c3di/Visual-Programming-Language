import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { extensions } from './NodeTypePackage';
import {
  VPEditor,
  type ISceneActions,
  type SerializedGraph,
  LoadPackageToRegistry,
} from './editor';
import './index.css';
import DockLayout, { LayoutData, TabData, BoxData, PanelData, DockContext, DockContextType } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { NodeDrawer } from './editor/gui';
import { NodeConfig } from './editor/types';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactFlowInstance } from 'reactflow';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneActionsMap: { [key: string]: ISceneActions | undefined } = {};
let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};

let count = 0;

function newTab(): TabData {
  count++;
  console.log('newTab ', count);
  return {
    id: `editor${count}`,
    title: `Editor ${count}`,
    closable: true,
    content: (
      <VPEditor
        id={`editor${count}`}
        onSceneActionsInit={(actions, instance) => {
          sceneActionsMap[`editor${count}`] = actions;
          sceneInstanceMap[`editor${count}`] = instance;
        }}
        option={{
          controller: { hidden: false },
          minimap: {
            collapsed: true,
          },
        }}
      />
    ),
  };
}


function App(): JSX.Element {
  const initialLayout: LayoutData = {
    dockbox: {
      mode: 'horizontal',
      size: 200,
      children: [
        {
          id: 'editor-panel',
          tabs: [
            newTab()
          ],
          panelLock: {
            minWidth: 200,
            panelExtra: (panelData, context) => (
              <button className='btn'
                onClick={() => {
                  context.dockMove(newTab(), panelData, 'middle');
                }}
              >
                add
              </button>
            )
          }
        },
      ],
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DockLayout
        defaultLayout={initialLayout}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);