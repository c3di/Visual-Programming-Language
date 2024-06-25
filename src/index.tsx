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
import DockLayout, { LayoutData, BoxData, TabData, PanelData } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import { NodeDrawer, CodePanel } from './editor/gui';
import { GenResult, NodeConfig } from './editor/types';
import type { ReactFlowInstance } from 'reactflow';
import { CodeProvider } from './editor/Context';
import { ChakraProvider, Box, Button, VStack, HStack, List, ListItem, Text, Icon } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';


Object.entries(extensions).forEach(([name, extension]) => {
  LoadPackageToRegistry(name, extension);
});

let sceneInstanceMap: { [key: string]: ReactFlowInstance | undefined } = {};
const EditorContext = createContext({});

function App(): JSX.Element {
  const [activeEditorId, setActiveEditorId] = useState('editor1');
  const countRef = useRef(0);
  const dockLayoutRef = useRef<any>(null);
  const [genResult, setGenResult] = useState<GenResult | undefined>();
  const [sceneActionsMap, setSceneActionsMap] = useState<{ [key: string]: ISceneActions | undefined }>({});
  const [editorGraphs, setEditorGraphs] = useState<{ [key: string]: SerializedGraph | undefined }>({});
  const sceneActionsMapRef = useRef<{ [key: string]: ISceneActions | undefined }>({});
  const [editors, setEditors] = useState<TabData[]>([
    {
      id: `editor0`,
      title: `Editor Main`,
      closable: true,
      content: (
        <VPEditor
          id={`editor0`}
          content={editorGraphs[`editor0`]}
          onContentChange={(content) => {
            setEditorGraphs((prev) => ({ ...prev, [`editor0`]: JSON.parse(content) }));
          }}
          activated={true}
          onSceneActionsInit={(actions, instance) => handleSceneActionsInit(actions, instance, `editor0`)}
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

  const handleSceneActionsInit = (actions: ISceneActions, instance: ReactFlowInstance | undefined, editorId: string) => {
    if (!instance) return;
    sceneInstanceMap[editorId] = instance;
    sceneActionsMapRef.current = { ...sceneActionsMapRef.current, [editorId]: actions };
    setSceneActionsMap({ ...sceneActionsMapRef.current });
  };

  /*useEffect(() => {
    console.log("editors", editors);
  }, [editors]);

  useEffect(() => {
    console.log("active Editor", activeEditorId);
  }, [activeEditorId]);*/

  useEffect(() => {
    const fetchSourceCode = async () => {
      const activeEditorId = dockLayoutRef.current.find('editor-panel').activeId;
      const sceneActions = sceneActionsMap[activeEditorId];
      if (sceneActions && sceneActions.sourceCode) {
        const sourceCodeResult = await sceneActions.sourceCode();
        setGenResult(sourceCodeResult);
      }
    };
    fetchSourceCode();
  }, [sceneActionsMap, activeEditorId]);


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
          content={editorGraphs[`editor${count}`]}
          onContentChange={(content) => {
            setEditorGraphs((prev) => ({ ...prev, [`editor${count}`]: JSON.parse(content) }));
          }}
          activated={dockLayoutRef.current.find('editor-panel').activeId === `editor${count}`}
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
  }, []);

  const handleReopenEditor = useCallback((editorToReopen) => {
    setActiveEditorId(editorToReopen.id);
    if (!dockLayoutRef.current.find(editorToReopen.id)) {
      const graphData = editorGraphs[editorToReopen.id];
      const reopenTab = {
        id: editorToReopen.id,
        title: editorToReopen.title,
        closable: true,
        content: (
          <VPEditor
            id={editorToReopen.id}
            content={graphData}
            onContentChange={(content) => {
              setEditorGraphs((prev) => ({ ...prev, [editorToReopen.id]: JSON.parse(content) }));
            }
            }
            activated={true}
            onSceneActionsInit={(actions, instance) => handleSceneActionsInit(actions, instance, editorToReopen.id)}
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
      dockLayoutRef.current.dockMove(reopenTab, 'editor-panel', 'middle');
    } else {
      dockLayoutRef.current.updateTab(editorToReopen.id, editorToReopen, true);
    }
  }, [editorGraphs]);


  const handleDeleteEditor = useCallback((editortodelete) => {
    setEditors(prevEditors => {
      const filteredEditors = prevEditors.filter(editor => editor.id !== editortodelete.id);
      return filteredEditors;
    });
  }, []);

  useEffect(() => {
    const editorPanel = dockLayoutRef.current.find('editor-panel');
    if (editorPanel && editorPanel.tabs) {
      const currentTabs = editorPanel.tabs;
      const stateTabIds = editors.map(editor => editor.id);

      const tabsToRemove = currentTabs.filter(tab => !stateTabIds.includes(tab.id));

      tabsToRemove.forEach(tab => {
        dockLayoutRef.current.dockMove(tab, null, 'remove');
      });
    }
  }, [editors, dockLayoutRef.current]);

  const editorList = useMemo(() => {
    return (
      <List spacing={3}>
        {editors.map(editor => (
          <ListItem key={editor.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg={editor.id === activeEditorId ? '#bee3f8ad' : 'gray.100'}
            _hover={{ bg: 'gray.200' }}
            p={2}
            borderRadius="md"
            onClick={() => handleReopenEditor(editor)}
            cursor="pointer">
            <Text >
              {editor.title}
            </Text>
            {editor.id !== 'editor0' && (<Icon as={CloseIcon} onClick={(e) => { e.stopPropagation(); handleDeleteEditor(editor) }} />)}
          </ListItem>
        ))}
      </List>
    );
  }, [editors, handleReopenEditor, handleDeleteEditor, handleAddEditor, activeEditorId]);


  function handleNodeClick(nodeConfig: NodeConfig) {
    const editorPanel = dockLayoutRef.current.find('editor-panel');
    const activeEditorId = editorPanel.activeId;
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
    const editorPanel = ((layoutData.dockbox.children[1] as BoxData).children[0] as PanelData);
    const activeEditorId = editorPanel.activeId;
    setActiveEditorId(activeEditorId ? activeEditorId : 'editor1');
  }, []);


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