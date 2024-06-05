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
import DockLayout, { LayoutData, TabData, BoxData, PanelData, DockContext } from 'rc-dock';
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

function MainArea({ id }: { id: string }): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(undefined);
  const [activated, setActivated] = useState<boolean>(false);

  const handleNodeClick = (nodeConfig: NodeConfig) => {
    const reactFlowBounds = document.querySelector('.vp-editor')?.getBoundingClientRect();
    const position = sceneInstanceMap[id]?.project({
      x: (reactFlowBounds?.left ?? 0) + 100,
      y: (reactFlowBounds?.top ?? 0) + 100,
    });

    if (position && sceneActionsMap[id]) {
      sceneActionsMap[id]?.addNode(nodeConfig.type, position, nodeConfig);
    }
  };

  const handleNodeDragStart = (
    event: React.DragEvent<HTMLLIElement>,
    nodeType: string,
    nodeConfig: NodeConfig
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
      <div style={{ flexGrow: 1 }}>
        <VPEditor
          id={id}
          content={content}
          onContentChange={(content) => {
            // ...
          }}
          activated={activated}
          onSceneActionsInit={(actions, instance) => {
            sceneActionsMap[id] = actions;
            sceneInstanceMap[id] = instance;
          }}
          onSelectionChange={(selection) => {
            // ...
          }}
          option={{
            controller: { hidden: false },
            minimap: {
              collapsed: true,
            },
          }}
        />
      </div>
    </div>
  );
}


let count = 0;

function newTab(): TabData {
  return {
    id: `editor${++count}`,
    title: `Editor ${count}`,
    content: <MainArea id={`editor${count}`} key={`editor${count}`} />,
  };
}

const initialLayout: LayoutData = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        tabs: [newTab()],
        panelLock: {
          minWidth: 200,
          panelExtra: (panelData: PanelData, dockContext: DockContext) => (
            <button className='btn'
              onClick={() => dockContext.dockMove(newTab(), panelData, 'middle')}>
              add
            </button>
          )
        }
      },
    ]
  },
};

function App(): JSX.Element {
  const [layout, setLayout] = useState<LayoutData>(initialLayout);
  const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DockLayout
        defaultLayout={layout}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
        onLayoutChange={(newLayout) => setLayout(newLayout as LayoutData)}
      />
      <div
        className={`node-drawer-container ${drawerExpanded ? 'expanded' : 'collapsed'}`}
      >
        <div
          className="drawer-handle"
          onClick={() => setDrawerExpanded(!drawerExpanded)}
          style={{
            position: 'absolute',
            right: drawerExpanded ? '295px' : '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '200px',
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 1,
          }}
        />
        <ChakraProvider>
          {drawerExpanded && (
            <NodeDrawer
              handleNodeDragStart={(event, nodeType, nodeConfig) => {
                event.dataTransfer.setData('application/reactflow', nodeType);
                event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
                event.dataTransfer.effectAllowed = 'move';
              }}
              handleNodeClick={(nodeConfig) => {
                Object.keys(sceneInstanceMap).forEach((id) => {
                  const reactFlowBounds = document.querySelector('.vp-editor')?.getBoundingClientRect();
                  const position = sceneInstanceMap[id]?.project({
                    x: (reactFlowBounds?.left ?? 0) + 100,
                    y: (reactFlowBounds?.top ?? 0) + 100,
                  });

                  if (position && sceneActionsMap[id]) {
                    sceneActionsMap[id]?.addNode(nodeConfig.type, position, nodeConfig);
                  }
                });
              }}
            />
          )}
        </ChakraProvider>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
