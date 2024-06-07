import React, { useState, useCallback, useMemo } from 'react';
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


function App(): JSX.Element {

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  let count = 0;

  function newTab(): TabData {
    count++;
    return {
      id: `editor${count}`,
      title: `Editor ${count}`,
      closable: true,
      content: (
        <VPEditor
          id={`editor${count}`}
          activated={activeTabId === `editor${count}`}
          onSceneActionsInit={(actions, instance) => {

            if (!instance) {
              return;
            }
            sceneActionsMap[`editor${count}`] = actions;
            sceneInstanceMap[`editor${count}`] = instance;
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
      ),
    };
  }


  const initialLayout = useMemo(() => ({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          id: 'editor-panel',
          tabs: [newTab()],
          panelLock: {
            minWidth: 200,
            panelExtra: (panelData, context) => (
              <button className='btn'
                onClick={() => {
                  context.dockMove(newTab(), panelData, 'middle');
                }}
              >
                Add
              </button>
            )
          }
        },
      ],
    },
  }), []);

  const handleLayoutChange = (layout: LayoutData, currentTabId: string, direction) => {
    console.log("Layout changed, active tab:", currentTabId);
    setActiveTabId(currentTabId);
  };

  const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false);

  const handleDrawerToggle = useCallback(() => {
    setDrawerExpanded((prev) => !prev);
  }, []);

  const renderNodeDrawer = useCallback(() => {
    return (
      <NodeDrawer
        handleNodeDragStart={(event, nodeType, nodeConfig) => {
          console.log('Node drag start');
          event.dataTransfer.setData('application/reactflow', nodeType);
          event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
          event.dataTransfer.effectAllowed = 'move';
        }}
        handleNodeClick={(nodeConfig) => {
          const reactFlowInstance = sceneInstanceMap[activeTabId || ''];
          if (!reactFlowInstance) {
            return;
          }

          const editorSelector = `#editor${activeTabId?.slice(6)}`;
          const reactFlowBounds = document.querySelector(editorSelector)?.getBoundingClientRect();

          if (!reactFlowBounds) {
            return;
          }

          const position = reactFlowInstance.project({
            x: reactFlowBounds.left + 100,
            y: reactFlowBounds.top + 100,
          });

          if (position && sceneActionsMap[activeTabId || '']) {
            sceneActionsMap[activeTabId || '']?.addNode(nodeConfig.type, position, nodeConfig);
          } else {
          }
        }}
      />
    );
  }, [activeTabId, sceneInstanceMap, sceneActionsMap]);



  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DockLayout
        defaultLayout={initialLayout}
        onLayoutChange={handleLayoutChange}
        style={{ position: 'absolute', left: 100, top: 0, right: 100, bottom: 30, zIndex: 2 }}
      />
      <div className={`node-drawer-container ${drawerExpanded ? 'expanded' : 'collapsed'}`}
        style={{
          zIndex: drawerExpanded ? 3 : 1
        }}>
        <div
          className="drawer-handle"
          onClick={handleDrawerToggle}
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
          }}
        />
        <ChakraProvider>
          {drawerExpanded && renderNodeDrawer()}
        </ChakraProvider>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);