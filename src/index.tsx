import React, { useState, useCallback, useMemo, useEffect, useRef, createContext } from 'react';
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
import { ChakraProvider, Box, Button, VStack, HStack, List, ListItem, Text, Icon } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};
const EditorContext = createContext({});

function App(): JSX.Element {
  const activeEditorIdRef = useRef('editor1');
  const countRef = useRef(1);
  const dockLayoutRef = useRef<any>(null);
  const [activeEditorId, setActiveEditorId] = useState<string>(activeEditorIdRef.current);
  const [genResult, setGenResult] = useState<GenResult | undefined>();
  const [sceneActionsMap, setSceneActionsMap] = useState<{ [key: string]: ISceneActions | undefined }>({});
  const sceneActionsMapRef = useRef<{ [key: string]: ISceneActions | undefined }>({});
  const [editors, setEditors] = useState<TabData[]>([
    {
      id: `editor1`,
      title: `Editor 1`,
      closable: true,
      content: (
        <VPEditor
          id={`editor1`}
          activated={activeEditorId === `editor1`}
          onSceneActionsInit={(actions, instance) => handleSceneActionsInit(actions, instance, `editor1`)}
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
    }
  ]);


  useEffect(() => {
    activeEditorIdRef.current = activeEditorId;
    console.log('activeEditorId', activeEditorId);
  }, [activeEditorId]);

  const handleSceneActionsInit = (actions: ISceneActions, instance: ReactFlowInstance | undefined, editorId: string) => {
    if (!instance) return;
    sceneInstanceMap[editorId] = instance;
    sceneActionsMapRef.current = { ...sceneActionsMapRef.current, [editorId]: actions };
    setSceneActionsMap({ ...sceneActionsMapRef.current });
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

  const handleAddEditor = useCallback(() => {
    const count = countRef.current + 1;
    countRef.current = count;
    const newTab = {
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
    setEditors(prev => [...prev, newTab]);
    dockLayoutRef.current.dockMove(newTab, 'editor-panel', 'middle');
    setActiveEditorId(newTab.id);
  }, [setActiveEditorId, setEditors]);

  const editorList = useMemo(() => {
    return (
      <List spacing={3}>
        {editors.map(editor => (
          <ListItem key={editor.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.100"
            _hover={{ bg: 'gray.200' }}
            p={2}
            borderRadius="md"
            onClick={() => { setActiveEditorId(editor.id); dockLayoutRef.current.dockMove(editor, 'editor-panel', 'middle'); }}
            cursor="pointer">
            <Text >
              {editor.title}
            </Text>
            <Icon as={CloseIcon} onClick={() => handleDeleteEditor(editor.id)} />
          </ListItem>
        ))}
      </List>
    );
  }, [editors, setActiveEditorId]);

  const handleDeleteEditor = useCallback((editorId: string) => {
    setEditors(prevEditors => {
      const filteredEditors = prevEditors.filter(editor => editor.id !== editorId);
      // If the active editor is deleted, activate the first remaining editor if any
      if (editorId === activeEditorId && filteredEditors.length > 0) {
        setActiveEditorId(filteredEditors[0].id);
      } else if (filteredEditors.length === 0) {
        setActiveEditorId('');
      }
      return filteredEditors;
    });
  }, [activeEditorId, setActiveEditorId]);


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
    if (position && sceneActionsMapRef.current[activeEditorId]) {
      sceneActionsMapRef.current[activeEditorId]?.addNode(nodeConfig.type, position, nodeConfig);
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
                  <ChakraProvider>
                    <Box
                      bg="gray.50"
                      overflow="auto"
                      position="absolute"
                      top={0}
                      bottom={0}
                      left={0}
                      right={0}
                    >
                      <VStack align="stretch" p={2} fontSize="sm">
                        <EditorContext.Consumer>
                          {(editorList) => (
                            <>
                              {editorList}
                            </>
                          )}
                        </EditorContext.Consumer>
                      </VStack>
                    </Box>
                  </ChakraProvider >

                ),
              }
              ],
              panelLock: {
                panelExtra: (panelData, context) => (
                  <button className='btn'
                    style={{ marginRight: 20, marginTop: "auto", backgroundColor: "#EDF2F7", padding: "revert" }}
                    onClick={handleAddEditor}>
                    Add
                  </button>
                )
              }
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
              tabs: editors,
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
  }, [editors]);

  return (
    <CodeProvider value={genResult}>
      <EditorContext.Provider value={editorList}>
        <DockLayout
          ref={dockLayoutRef}
          defaultLayout={initialLayout}
          onLayoutChange={handleLayoutChange}
          style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}
        />
      </EditorContext.Provider>
    </CodeProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);