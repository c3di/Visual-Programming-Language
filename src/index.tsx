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
import { CodeProvider } from './editor/gui/CodeContext';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};


function App(): JSX.Element {
  const [editors, setEditors] = useState<TabData[]>([]);
  const activeEditorIdRef = useRef('editor1');
  const countRef = useRef(0);
  const dockLayoutRef = useRef<any>(null);
  const [activeEditorId, setActiveEditorId] = useState<string>(activeEditorIdRef.current);
  const [genResult, setGenResult] = useState<GenResult | undefined>();
  const [sceneActionsMap, setSceneActionsMap] = useState<{ [key: string]: ISceneActions | undefined }>({});

  useEffect(() => {
    activeEditorIdRef.current = activeEditorId;
  }, [activeEditorId]);

  const handleSceneActionsInit = (actions: ISceneActions, instance: ReactFlowInstance | undefined, editorId: string) => {
    if (!instance) return;
    setSceneActionsMap((prevMap) => ({
      ...prevMap,
      [editorId]: actions,
    }));
  };

  useEffect(() => {
    const fetchSourceCode = async () => {
      const activeEditorId = activeEditorIdRef.current;
      const sceneActions = sceneActionsMap[activeEditorId];
      if (sceneActions && sceneActions.sourceCode) {
        const sourceCodeResult = await sceneActions.sourceCode();
        setGenResult(sourceCodeResult);
      }
    };
    fetchSourceCode();
  }, [sceneActionsMap]);

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
          onSceneActionsInit={(actions, instance) => handleSceneActionsInit(actions, instance, `editor${count}`)}
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
          mode: 'vertical',
          size: 300,
          children: [
            {
              size: 600,
              tabs: [{
                id: 'node-panel',
                title: 'Node Library',
                content: (
                  <NodeDrawer handleNodeClick={handleNodeClick} handleNodeDragStart={handleNodeDragStart} />
                )
              }
              ],
            },
            {
              size: 200,
              tabs: [{
                id: 'editor-management',
                title: 'Editor Management',
                content: (
                  <> </>
                ),
              }
              ]
            },
          ],
        },
        {
          mode: 'vertical',
          size: 1000,
          children: [
            {
              size: 600,
              id: 'editor-panel',
              tabs: [newEditorTab()],
              panelLock: {
                panelStyle: 'main',
              }
            },
            {
              size: 200,
              tabs: [{
                id: `code-panel`,
                title: `Code Panel`,
                content: <CodePanel />
              }],

            }
          ],
        },
      ],
    },
  }), [editors, genResult]);

  const handleLayoutChange = useCallback((layoutData: LayoutData, currentTabId, direction) => {
    const findEditorPanel = (panel) => {
      if (panel.id === 'editor-panel') {
        return panel;
      }
      if (panel.children) {
        for (const child of panel.children) {
          const found = findEditorPanel(child);
          if (found) return found;
        }
      }
      return null;
    };
    const editorPanel = findEditorPanel(layoutData.dockbox);
    if (editorPanel && editorPanel.activeId) {
      setActiveEditorId(editorPanel.activeId);
    }
  }, []);

  return (
    <CodeProvider value={genResult}>
      <DockLayout
        defaultLayout={initialLayout}
        onLayoutChange={handleLayoutChange}
        style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}
      />
    </CodeProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);