import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import example from './VPFileExample.json';
import { extensions } from './NodeTypePackage';
import {
  VPEditor,
  type ISceneActions,
  type SerializedGraph,
  LoadPackageToRegistry,
} from './editor';
import './index.css';
import { deepCopy } from './editor/util';
import { nodeConfigRegistry } from './editor/extension';
import DockLayout from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { NodeDrawer } from './editor/gui';
import { NodeConfig } from './editor/types';
import { ChakraProvider } from '@chakra-ui/react';



Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneActions: ISceneActions | undefined;

function MainArea({ id }: { id: string }): JSX.Element {
  const [content, setContent] = useState<SerializedGraph | undefined>(
    undefined
  );
  const [activated, setActivated] = useState<boolean>(false);
  const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false);

  const handleNodeClick = (nodeConfig: NodeConfig) => {
    const reactFlowBounds = document.querySelector('.vp-editor')?.getBoundingClientRect();
    const position = sceneActions?.instance?.project({
      x: (reactFlowBounds?.left ?? 0) + 100,
      y: (reactFlowBounds?.top ?? 0) + 100,
    });

    if (position && sceneActions) {
      sceneActions.addNode(nodeConfig.type, position, nodeConfig);
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
      <button
        onClick={() => {
          sceneActions?.clear();
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          sceneActions?.autoLayout();
        }}
      >
        auto layout
      </button>
      <button
        onClick={() => {
          const sourceCode = sceneActions?.sourceCode();
          console.log(sourceCode);
        }}
      >
        source code
      </button>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
        <div style={{ flexGrow: 1 }}>
          <VPEditor
            id={id}
            content={content}
            onContentChange={(content) => {
              // ...
            }}
            activated={activated}
            onSceneActionsInit={(actions) => {
              // ...
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
        <div
          className={`node-drawer-container ${drawerExpanded ? 'expanded' : 'collapsed'}`}
        >
          <div
            className="drawer-handle"
            onClick={() => setDrawerExpanded(!drawerExpanded)}
            style={{
              position: 'absolute',
              right: drawerExpanded ? '295px' : '5px',
              top: '550px',
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
                handleNodeDragStart={handleNodeDragStart}
                handleNodeClick={handleNodeClick}
              />
            )}
          </ChakraProvider>
        </div>
      </div>
    </>
  );
}

function App(): JSX.Element {
  return (
    <>
      <MainArea id={'b1'} />
    </>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
