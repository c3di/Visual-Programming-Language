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
import DockLayout, { LayoutData, TabData } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { NodeDrawer, CodePanel } from './editor/gui';
import { GenResult, NodeConfig } from './editor/types';
import type { ReactFlowInstance } from 'reactflow';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneActionsMap: { [key: string]: ISceneActions | undefined } = {};
let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};


function App(): JSX.Element {
  const activeEditorIdRef = useRef('editor1');
  const [activeEditorId, setActiveEditorId] = useState<string>(activeEditorIdRef.current);
  const [code, setCode] = useState<GenResult | undefined>();

  useEffect(() => {
    activeEditorIdRef.current = activeEditorId;
    console.log("New active editor id:", activeEditorIdRef.current);
  }, [activeEditorId]);

  useEffect(() => {
    const getCode = () => {
      const actions = sceneActionsMap[activeEditorId];
      if (actions && actions.sourceCode()) {
        const sourceCode = actions.sourceCode();
        setCode(sourceCode);
      }
    }
    getCode();
  }, [activeEditorId]);

  let count = 0;

  function newEditorTab(): TabData {
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
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeConfig', JSON.stringify(nodeConfig));
    event.dataTransfer.effectAllowed = 'move';
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
          mode: 'vertical',
          size: 800,
          children: [
            {
              id: 'editor-panel',
              tabs: [newEditorTab()],
              panelLock: {
                panelStyle: 'main',
                panelExtra: (panelData, context) => (
                  <button className='btn'
                    onClick={() => {
                      context.dockMove(newEditorTab(), panelData, 'middle');
                    }}
                  >
                    Add
                  </button>
                )
              }
            },
            {
              id: 'code-panel',
              tabs: [{
                id: `codepanel${count}`,
                title: `Code Panel ${count}`,
                closable: true,
                content: <CodePanel code={code} />
              }],

            }
          ],
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