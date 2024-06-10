import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
import type { ReactFlowInstance } from 'reactflow';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneActionsMap: { [key: string]: ISceneActions | undefined } = {};
let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};


function App(): JSX.Element {
  const activeEditorIdRef = useRef('editor1');
  const [activeEditorId, setActiveEditorId] = useState<string>(activeEditorIdRef.current);

  useEffect(() => {
    activeEditorIdRef.current = activeEditorId;
    console.log("New active editor id:", activeEditorIdRef.current);
  }, [activeEditorId]);

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
          activated={activeEditorId === `editor${count}`}
          onSceneActionsInit={(actions, instance) => {
            if (!instance) return;
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

  function handleNodeClick(nodeConfig: NodeConfig) {
    const activeEditorId = activeEditorIdRef.current;
    console.log("active editor for node click:", activeEditorId)
    const reactFlowInstance = sceneInstanceMap[activeEditorId || ''];
    if (!reactFlowInstance) {
      console.error(`ReactFlow instance for id ${activeEditorId} is undefined`);
      return;
    }
    const reactFlowBounds = document.querySelector(`#${activeEditorId}`)?.getBoundingClientRect();
    if (!reactFlowBounds) {
      console.error('ReactFlow bounds are undefined');
      return;
    }
    const position = reactFlowInstance.project({
      x: reactFlowBounds.left + 100,
      y: reactFlowBounds.top + 100,
    });
    if (position && sceneActionsMap[activeEditorId || '']) {
      sceneActionsMap[activeEditorId || '']?.addNode(nodeConfig.type, position, nodeConfig);
    } else {
      console.error('Position or sceneActionsMap is undefined');
    }
  };

  function handleNodeDragStart(event, nodeType, nodeConfig) {
    console.log('Attempting to start drag:', { nodeType, nodeConfig });

    if (!event) {
      console.error('Drag event is undefined.');
      return;
    }
    // event.stopPropagation();
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
    event.dataTransfer.effectAllowed = 'move';
    console.log('Node drag start triggered', { nodeType, nodeConfig });
  };


  const initialLayout = useMemo(() => ({
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          tabs: [
            {
              id: 'node-panel',
              maxWidth: 300,
              title: 'Node Library',
              content: (
                <NodeDrawer handleNodeClick={handleNodeClick} handleNodeDragStart={handleNodeDragStart} />
              )
            }
          ]
        },
        {
          id: 'editor-panel',
          size: 800,
          tabs: [newTab()],
          panelLock: {
            panelStyle: 'main',
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

  const handleLayoutChange = useCallback((layoutData: LayoutData, currentTabId, direction) => {
    const editorPanel = layoutData.dockbox.children.find(panel => panel.id === 'editor-panel');
    if (editorPanel && editorPanel.activeId) {
      setActiveEditorId(editorPanel.activeId);
    } else {
      console.log("No active editor tab was found in the layout change.");
    }
  }, [setActiveEditorId]);

  return (
    <DockLayout
      defaultLayout={initialLayout}
      onLayoutChange={handleLayoutChange}
      style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}
    />
  );
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);