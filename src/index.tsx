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
  const [layout, setLayout] = useState<LayoutData>({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          id: 'editor-panel',
          tabs: [newTab()],
          panelLock: {
            minWidth: 200,
            panelExtra: (panelData) => {
              console.log("Rendering panelExtra", panelData);
              return (
                <div className="dock-extra-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      alert('Button clicked!');
                      console.log('Add button clicked', panelData.id); // Add log here
                      const newTabData = newTab();
                      setLayout((prevLayout) => {
                        const updatedLayout = { ...prevLayout };
                        const targetPanel = (updatedLayout.dockbox.children.find(
                          (child) => 'id' in child && child.id === panelData.id
                        ) as PanelData);
                        if (targetPanel && targetPanel.tabs) {
                          console.log('Adding new tab to panel:', targetPanel.id); // Add log here
                          targetPanel.tabs.push(newTabData);
                        } else {
                          console.error('No matching panel found or panel does not have tabs:', panelData.id);
                        }
                        console.log('Updated layout:', updatedLayout); // Add log here
                        return updatedLayout;
                      });
                    }}
                  >
                    Add
                  </button>
                </div>
              );
            },
          },
        },
      ],
    },
  });
  const [drawerExpanded, setDrawerExpanded] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DockLayout
        defaultLayout={layout}
        style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}
        onLayoutChange={(newLayout) => {
          console.log('Layout changed:', newLayout);
          setLayout(newLayout as LayoutData)
        }} />

      < div
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
                console.log('Node drag start');
                event.dataTransfer.setData('application/reactflow', nodeType);
                event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
                event.dataTransfer.effectAllowed = 'move';
              }}
              handleNodeClick={(nodeConfig) => {
                console.log('Node clicked:', nodeConfig);
                Object.keys(sceneInstanceMap).forEach((id) => {
                  const reactFlowBounds = document.querySelector('.vp-editor')?.getBoundingClientRect();
                  const position = sceneInstanceMap[id]?.project(
                    {
                      x: (reactFlowBounds?.left ?? 0) + 100,
                      y: (reactFlowBounds?.top ?? 0) + 100,
                    });
                  console.log('Position:', position, 'sceneActionsMap:', sceneActionsMap[id]);
                  if (position && sceneActionsMap[id]) {
                    console.log('Adding node to scene', id, ': ', nodeConfig.type, position, nodeConfig);
                    sceneActionsMap[id]?.addNode(nodeConfig.type, position, nodeConfig);
                  }
                });
              }}
            />
          )}
        </ChakraProvider>
      </div >
    </div >
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
