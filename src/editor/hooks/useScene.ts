import ContentPaste from '@mui/icons-material/ContentPaste';
import ELK from 'elkjs/lib/elk.bundled.js';
import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  getRectOfNodes,
  useReactFlow,
  type Connection,
  type Node as RcNode,
  type ReactFlowInstance,
  type XYPosition,
} from 'reactflow';
import { deserializer } from '../Deserializer';
import { VisualProgram, pythonGenerator, type GenResult } from '../generators';
import type {
  ClipboardInfo,
  ConnectionStatus,
  Edge,
  Graph,
  Node,
  selectedElementsCounts,
} from '../types';
import { isCommentNode } from '../types';
import { copy, deepCopy, fromClientCoordToScene } from '../util';
import { UniqueNamePool, type IUniqueNamePool } from '../utils';
import { type GraphState } from './useGraph';
import useGui, { type Command, type IGui } from './useGui';

function nodeInsideOfNode(n: Node, containter: Node): boolean {
  return (
    n.position.x > containter.position.x &&
    n.position.x + (n.width ?? 0) <
      containter.position.x + (containter.width ?? 0) &&
    n.position.y > containter.position.y &&
    n.position.y + (n.height ?? 0) <
      containter.position.y + (containter.height ?? 0)
  );
}

export interface ISceneActions {
  getSelectedCounts: () => selectedElementsCounts;
  setSelectedCounts: (newCounts: selectedElementsCounts) => void;
  selectAll: (sure: boolean) => void;
  selectEdge: (edgeId: string) => void;
  selectNode: (nodeId: string) => void;
  getNodeById: (nodeId: string) => Node | undefined;
  addNode: (
    configType: string,
    thisPosition?: XYPosition,
    data?: any,
    positionOffset?: XYPosition
  ) => Node;
  addNodeWithSceneCoord: (
    configType: string,
    anchorPosition: { top: number; left: number }
  ) => Node;
  addEdge: (params: Connection) => void;
  setNodes: Dispatch<SetStateAction<Array<RcNode<any, string | undefined>>>>;
  setExtraCommands: Dispatch<SetStateAction<Command[]>>;
  clearEdgeSelection: () => void;
  getHandleConnectionCounts: (nodeId: string, handleId: string) => number;
  onNodeDragStart: (evt: any, node: Node) => void;
  onNodeDragStop: (evt: any, node: Node) => void;
  copySelectedNodeToClipboard: () => void;
  pasteFromClipboard: (pos?: XYPosition) => void;
  deleteSelectedElements: () => void;
  duplicateSelectedNodes: () => void;
  cutSelectedNodesToClipboard: () => void;
  clear: () => void;
  deleteEdge: (id: string) => void;
  deleteAllEdgesOfNode: (nodeId: string) => void;
  deleteAllEdgesOfHandle: (nodeId: string, handleId: string) => void;
  deleteAllEdgesOfSelectedNodes: () => void;
  isValidConnection: (params: any) => ConnectionStatus;
  centerSelectedNodes: () => void;
  onNodesDelete: (nodes: Node[]) => void;
  selectedNodes: () => Node[];
  sortZIndexOfComments: (nodes: Node[]) => Node[];
  autoLayout: () => void;
  deleteHandle: (nodeId: string, nodeType: string, handleId: string) => void;
  sourceCode: () => GenResult;
  closeMenu?: () => void;
}
export interface ISceneState {
  gui: IGui;
  anyConnectableNodeSelected: boolean;
  anyConnectionToSelectedNode: boolean;
  extraCommands: Command[];
  varsNamePool: React.MutableRefObject<IUniqueNamePool>;
  funNamePool: React.MutableRefObject<IUniqueNamePool>;
  sceneActions: ISceneActions;
}

export default function useScene(
  graphState: GraphState,
  mousePos: React.MutableRefObject<{
    mouseX: number;
    mouseY: number;
  }>,
  reactflowInstance: React.MutableRefObject<ReactFlowInstance | undefined>,
  domReference: React.RefObject<HTMLDivElement>
): ISceneState {
  const { selectedNodes, edges, getFreeUniqueNodeIds } = graphState;
  const [extraCommands, setExtraCommands] = useState<Command[]>([]);
  const { setCenter, getZoom, project } = useReactFlow();

  const varsNamePool = useRef<IUniqueNamePool>(new UniqueNamePool());
  const funNamePool = useRef<IUniqueNamePool>(new UniqueNamePool());

  const gui = useGui();
  const saveNodesInSelectedCommentNode = (draggedNode: Node): void => {
    graphState.setNodes((nodes) => {
      nodes.forEach((n) => {
        if (n.id === draggedNode.id && !n.selected) {
          n.selected = true;
        }
      });
      const selectedCommentNodes = nodes.filter(
        (n) => isCommentNode(n.data) && n.selected
      );

      selectedCommentNodes.forEach((node) => {
        const alreadyInComment = (n: Node): boolean => {
          return n.parentNode === undefined;
        };
        const nodesInComment = nodes.filter(
          (n) =>
            !n.selected &&
            nodeInsideOfNode(n, node) &&
            n.id !== node.id &&
            alreadyInComment(n)
        );
        if (!nodesInComment) return;
        nodesInComment.forEach((n) => {
          n.position.x -= node.position.x;
          n.position.y -= node.position.y;
          n.parentNode = node.id;
        });
      });
      return nodes;
    });
  };

  const clearNodesInSelectedCommentNode = (): void => {
    graphState.setNodes((nodes) => {
      const newNodes = nodes.map((node) => {
        if (node.parentNode) {
          const parentNode = nodes.find(
            (n) => n.id === node.parentNode
          ) as Node;
          node.position.x += parentNode.position.x;
          node.position.y += parentNode.position.y;
          node.parentNode = undefined;
        }
        return node;
      });
      sortZIndexOfComments(newNodes);
      return newNodes;
    });
  };

  const onNodeDragStart = (evt: any, node: Node): void => {
    saveNodesInSelectedCommentNode(node);
  };
  const onNodeDragStop = (evt: any, node: Node): void => {
    clearNodesInSelectedCommentNode();
  };

  const copySelectedNodeToClipboard = (): void => {
    const clipboard: ClipboardInfo = {
      hasNodes: false,
      nodes: {},
      edges: [],
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
    };
    const selectedNds = selectedNodes();
    if (selectedNds.length === 0) return;
    selectedNds.forEach((node) => {
      clipboard.nodes[node.id] = copy(node);
      clipboard.minX = Math.min(clipboard.minX, node.position.x);
      clipboard.minY = Math.min(clipboard.minY, node.position.y);
    });
    clipboard.hasNodes = Object.keys(clipboard.nodes).length !== 0;
    if (!clipboard.hasNodes) return;
    clipboard.edges = edges.filter((edge) => {
      return clipboard.nodes[edge.source] && clipboard.nodes[edge.target];
    });
    const clipboardStr = JSON.stringify(clipboard);
    navigator.clipboard
      .writeText(clipboardStr)
      .then(() => {
        setExtraCommands((commands) => {
          const newCmd = {
            name: 'Paste',
            action: (
              item?: any,
              e?: React.MouseEvent<HTMLLIElement>,
              menuClientPos?: { top: number; left: number }
            ) => {
              pasteFromClipboard(
                menuClientPos
                  ? fromClientCoordToScene(
                      {
                        clientX: menuClientPos.left,
                        clientY: menuClientPos.top,
                      },
                      domReference,
                      project
                    )
                  : undefined
              );
            },
            labelIcon: ContentPaste,
            labelInfo: 'Ctrl+V',
            tooltip: 'Paste from the clipboard',
          };
          const index = commands.findIndex((cmd) => cmd.name === 'Paste');
          if (index !== -1) {
            commands[index] = newCmd;
            return commands;
          } else return [...commands, newCmd];
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const pasteFromClipboard = (pos?: XYPosition): void => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const clipboard: ClipboardInfo = JSON.parse(text);
        if (!clipboard?.hasNodes) return;
        const newNodes: Record<string, Node> = {};
        const newIds = getFreeUniqueNodeIds(
          Object.keys(clipboard.nodes).length
        );
        const originX = pos?.x ?? mousePos.current.mouseX;
        const originY = pos?.y ?? mousePos.current.mouseY;
        Object.keys(clipboard.nodes).forEach((id) => {
          const node = clipboard.nodes[id];
          const newId = newIds.shift();
          const newNode = {
            ...node,
            id: newId,
            selected: true,
            position: {
              x: node.position.x - (clipboard.minX - originX),
              y: node.position.y - (clipboard.minY - originY),
            },
          };
          newNodes[id] = newNode as Node;
        });

        const newEdges = clipboard.edges.map((edge) => {
          const sourceId = newNodes[edge.source].id;
          const targetId = newNodes[edge.target].id;
          return {
            ...edge,
            id: `e${sourceId}-${edge.sourceHandle!}-${targetId}-${edge.targetHandle!}`,
            selected: true,
            source: sourceId,
            target: targetId,
          };
        });

        Object.values(newNodes).forEach((node) => {
          Object.values(node.data.inputs ?? {}).forEach((input: any) => {
            input.connection = 0;
          });
          Object.values(node.data.outputs ?? {}).forEach((output: any) => {
            output.connection = 0;
          });
        });

        for (const edge of newEdges) {
          const sourceNode = getNodeByIdIn(
            edge.source,
            Object.values(newNodes)
          );
          const targetNode = getNodeByIdIn(
            edge.target,
            Object.values(newNodes)
          );
          if (!sourceNode || !targetNode) continue;
          const sourceOutput = sourceNode.data.outputs[edge.sourceHandle!];
          const targetInput = targetNode.data.inputs[edge.targetHandle!];
          sourceOutput.connection++;
          targetInput.connection++;
        }

        Object.values(newNodes).forEach((node) => {
          if (node.data.configType === 'reroute') {
            if (
              node.data.inputs.input.connection === 0 &&
              node.data.outputs.output.connection === 0
            ) {
              node.data.dataType = 'any';
              node.data.inputs.input.dataType = 'any';
              node.data.outputs.output.dataType = 'any';
            }
          }
        });

        Object.values(newNodes).forEach((node) => {
          if (node.type === 'createFunction') {
            node.data.title = funNamePool.current.createNew('newFun');
            funNamePool.current.add(node.data.title);

            const returnNode = newNodes[node.data.nodeRef];
            if (returnNode && returnNode.type === 'return')
              node.data.nodeRef = returnNode.id;
            else node.data.nodeRef = null;
          }
        });

        const execStartNodeKey = Object.keys(newNodes).find(
          (key) => newNodes[key].data.configType === 'Flow Control.main'
        );

        if (execStartNodeKey) {
          const execStartNode = newNodes[execStartNodeKey];
          const config = deserializer.serializedToGraphNodeConfig({
            id: execStartNode.id,
            type: 'Function & Variable Creation.new function',
            position: execStartNode.position,
            selected: true,
          });
          newNodes[execStartNodeKey] = deserializer.configToNode(config);
        }

        graphState.selectAll(false);
        for (const node of Object.values(newNodes)) {
          onNodeAdd(node);
        }
        graphState.addElements({
          newNodes: Object.values(newNodes),
          newEdges,
        });
      })
      .catch((err) => {
        console.error('Failed to paste: ', err);
      });
  };

  const duplicateSelectedNodes = (): void => {
    copySelectedNodeToClipboard();
    pasteFromClipboard();
  };

  const cutSelectedNodesToClipboard = (): void => {
    copySelectedNodeToClipboard();
    graphState.deleteSelectedNodes();
  };

  const addNode = useCallback(
    (
      configType: string,
      thisPosition?: XYPosition,
      data?: any,
      positionOffset?: XYPosition
    ): Node => {
      const id = getFreeUniqueNodeIds(1)[0];
      const position = thisPosition ?? {
        x: mousePos.current.mouseX,
        y: mousePos.current.mouseY,
      };
      if (positionOffset) {
        position.x += positionOffset.x;
        position.y += positionOffset.y;
      }
      if (configType === 'Flow Control.main') {
        const existingExecStartNode = graphState
          .getNodes()
          .find((n) => n.data.configType === 'Flow Control.main');
        if (existingExecStartNode) {
          configType = 'Function & Variable Creation.new function';
        }
      }
      const config = deserializer.serializedToGraphNodeConfig({
        id,
        title: data?.title,
        type: configType,
        position,
        inputs: data?.inputs,
        outputs: data?.outputs,
        nodeRef: data?.nodeRef,
        ...data,
      });
      const node = deserializer.configToNode(config);
      onNodeAdd(node);
      graphState.addElements({ newNodes: [node] });
      return node;
    },
    []
  );

  const addNodeWithSceneCoord = (
    configType: string,
    anchorPosition: { top: number; left: number }
  ): Node => {
    const node = addNode(
      configType,
      fromClientCoordToScene(
        { clientX: anchorPosition.left, clientY: anchorPosition.top },
        domReference,
        project
      )
    );
    return node;
  };

  const deleteHandle = (
    nodeId: string,
    configType: string,
    handleId: string
  ): void => {
    if (configType.includes('new function')) {
      deleteOutputHandleOfCreateFunction(nodeId, handleId);
    } else if (configType.includes('return')) {
      deleteInputHandleOfReturnNode(nodeId, handleId);
    } else if (configType.includes('sequence')) {
      deleteHandleOfSequenceNode(nodeId, handleId);
    } else {
      deleteHandleOfNormalNode(nodeId, handleId);
    }
  };

  const deleteHandleOfNormalNode = (nodeId: string, handleId: string): void => {
    graphState.setNodes((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          if (Object.keys(nd.data.inputs ?? {}).includes(handleId)) {
            const { [handleId]: _, ...remained } = nd.data.inputs;
            nd.data.inputs = remained;
          } else {
            const { [handleId]: _, ...remained } = nd.data.outputs;
            nd.data.outputs = remained;
          }
        }
        return nd;
      });
    });
  };

  const deleteHandleOfSequenceNode = (
    nodeId: string,
    handleId: string
  ): void => {
    graphState.setNodes((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          const { [handleId]: _, ...remained } = nd.data.outputs;
          Object.keys(remained).forEach((key, index) => {
            const newTitle = `Then ${index}`;
            remained[key].title = newTitle;
          });
          nd.data.outputs = remained;
        }

        return nd;
      });
    });
  };

  const deleteOutputHandleOfCreateFunction = (
    nodeId: string,
    handleId: string
  ): void => {
    const nodeIds: string[] = [];
    graphState.setNodes((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nodeIds.push(nd.id);
          const { [handleId]: _, ...remained } = nd.data.outputs;
          nd.data.outputs = remained;
        }
        if (nd.data.nodeRef === nodeId) {
          nodeIds.push(nd.id);
          const { [handleId]: _, ...remained } = nd.data.inputs;
          nd = {
            ...nd,
            data: {
              ...nd.data,
              inputs: remained,
            },
          };
        }
        return nd;
      });
    });
    nodeIds.forEach((id) => {
      graphState.deleteAllEdgesOfHandle(id, handleId);
    });
  };

  const deleteInputHandleOfReturnNode = useCallback(
    (nodeId: string, handleId: string) => {
      const nodeIds: string[] = [];
      graphState.setNodes((nds) => {
        return nds.map((nd) => {
          if (nd.id === nodeId) {
            nodeIds.push(nd.id);
            const { [handleId]: _, ...remained } = nd.data.inputs;
            nd.data.inputs = remained;
          }
          const ref = graphState.getNodeById(nd.data.nodeRef);
          if (ref?.data.nodeRef === nodeId) {
            nodeIds.push(nd.id);
            const { [handleId]: _, ...remained } = nd.data.outputs;
            nd = {
              ...nd,
              data: {
                ...nd.data,
                outputs: remained,
              },
            };
          }
          return nd;
        });
      });
      nodeIds.forEach((id) => {
        graphState.deleteAllEdgesOfHandle(id, handleId);
      });
    },
    []
  );

  const onNodeAdd = (node: Node): void => {
    if (node.type === 'createVariable') {
      setExtraCommands((commands) => {
        if (
          !node.data.inputs.name.value &&
          !node.data.inputs.name.defaultValue
        ) {
          node.data.inputs.name.value =
            varsNamePool.current.createNew('newVar');
        }
        varsNamePool.current.add(
          node.data.inputs.name.value ?? node.data.inputs.name.defaultValue
        );
        return [
          ...commands,
          {
            name:
              node.data.inputs.name.value ?? node.data.inputs.name.defaultValue,
            action: (
              item: any,
              e:
                | React.MouseEvent<HTMLLIElement>
                | undefined
                | { clientX: number; clientY: number }
            ) => {
              const position = {
                left: e?.clientX ?? 0,
                top: e?.clientY ?? 0,
              };
              gui.openWidget('getterSetterMenu', position, {
                createVarNodeRef: node.id,
                position,
              });
            },
            category: 'Variables',
            categoryRank: 0,
          },
        ];
      });
    } else if (node.type === 'createFunction') {
      setExtraCommands((commands) => {
        if (!node.data.title) {
          node.data.title = funNamePool.current.createNew('newFun');
        }
        funNamePool.current.add(node.data.title);
        return [
          ...commands,
          {
            name: node.data.title,
            action: (
              item: any,
              e: React.MouseEvent<HTMLLIElement> | undefined
            ) => {
              const latest = deepCopy(graphState.getNodeById(node.id));
              Object.values(latest.data.outputs).forEach((output: any) => {
                output.showWidget = true;
                output.showTitle = output.dataType !== 'exec';
                output.connection = 0;
              });
              const outputs: Record<string, any> = {
                functionCallExecOut: {
                  title: 'functionCallExecOut', // hardcode
                  dataType: 'exec',
                  showWidget: false,
                  showTitle: false,
                },
              };
              const returnNodeId = latest?.data?.nodeRef;
              const returnNode = returnNodeId
                ? deepCopy(graphState.getNodeById(returnNodeId))
                : undefined;
              Object.keys(returnNode?.data.inputs ?? {}).forEach(
                (name: string) => {
                  const input = returnNode.data.inputs[name];
                  if (input.dataType === 'exec') return;
                  input.showWidget = false;
                  input.showTitle = true;
                  input.connection = 0;
                  outputs[name] = input;
                }
              );

              addNode('Function & Variable Creation.function call', undefined, {
                title: latest.data.title,
                nodeRef: node.id,
                inputs: latest.data.outputs,
                outputs,
              });
            },
            category: 'Functions',
            categoryRank: 1,
          },
        ];
      });
    } else if (node.type === 'comment') {
      let nds = graphState.getNodes();
      nds.push(node);
      nds = sortZIndexOfComments(nds);
      graphState.setNodes(nds.filter((n) => n.id !== node.id));
    }
  };

  const onNodesDelete = (nodes: Node[]): void => {
    nodes.forEach((node) => {
      if (node.type === 'createVariable') {
        const name =
          node.data.inputs.name.value ?? node.data.inputs.name.defaultValue;
        setExtraCommands((commands) => {
          return commands.filter((command) => command.name !== name);
        });
        graphState.deleteNodes(varsNamePool.current.itemRef(name) ?? []);
        varsNamePool.current.remove(name);
      } else if (node.type === 'setter' || node.type === 'getter') {
        const name =
          node.data.inputs.setter?.title ?? node.data.inputs.getter?.title;
        varsNamePool.current.removeRef(name, node.id);
      } else if (node.type === 'createFunction') {
        const name = node.data.title;
        setExtraCommands((commands) => {
          return commands.filter((command) => command.name !== name);
        });
        graphState.deleteNodes(funNamePool.current.itemRef(name) ?? []);
        funNamePool.current.remove(name);
      } else if (node.type === 'functionCall') {
        const name = node.data.title;
        funNamePool.current.removeRef(name, node.id);
      } else if (node.type === 'return') {
        graphState.setNodes((nodes) =>
          nodes.map((n) => {
            if (n.type === 'functionCall' && n.data.nodeRef) {
              const refNode = graphState.getNodeById(n.data.nodeRef);
              if (refNode?.data.nodeRef === node.id) {
                n.data = {
                  ...n.data,
                  outputs: { execOut: n.data.outputs.execIn },
                };
              }
            }
            return n;
          })
        );
        graphState.setNodes((nodes) =>
          nodes.map((n) => {
            if (n.type === 'createFunction' && n.data.nodeRef === node.id) {
              n.data = {
                ...n.data,
                nodeRef: undefined,
              };
            }
            return n;
          })
        );
      }
    });
  };

  const initGraph = useRef<Graph | null>(null);
  if (
    graphState.initGraph &&
    JSON.stringify(initGraph.current) !== JSON.stringify(graphState.initGraph)
  ) {
    initGraph.current = graphState.initGraph;
    initGraph.current.nodes.forEach((node) => {
      onNodeAdd(node);
    });
  }

  const centerSelectedNodes = (): void => {
    const nodes = selectedNodes();
    if (nodes.length === 0) return;
    const { x, y, width, height } = getRectOfNodes(nodes);
    setCenter(x + width / 2.0, y + height / 2.0, {
      duration: 200,
      zoom: getZoom(),
    });
  };

  const deleteSelectedElements = (): void => {
    onNodesDelete(selectedNodes());
    graphState.deleteSelectedElements();
  };

  function sortZIndexOfComments(nodes: Node[]): Node[] {
    const selectedCommentNodes = nodes.filter((n) => isCommentNode(n.data));
    const nodesInSizeAsec = selectedCommentNodes.sort((a, b) => {
      return (
        (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0)
      );
    });
    const hasChild: Record<string, boolean> = {};
    for (let i = 0; i < nodesInSizeAsec.length; i++) {
      for (let j = i + 1; j < nodesInSizeAsec.length; j++) {
        if (!hasChild[nodesInSizeAsec[i].id]) nodesInSizeAsec[i].zIndex = -1001;
        if (nodeInsideOfNode(nodesInSizeAsec[i], nodesInSizeAsec[j])) {
          nodesInSizeAsec[j].zIndex = Math.min(
            nodesInSizeAsec[j].zIndex!,
            nodesInSizeAsec[i].zIndex! - 1001
          );
          hasChild[nodesInSizeAsec[j].id] = true;
          break;
        }
      }
    }
    return nodes;
  }

  const autoLayout = useCallback(() => {
    const ns = graphState.getNodes();
    const es = graphState.getEdges();
    window.requestAnimationFrame(() => {
      getAlignedElements(ns, es).then(
        ({ nodes, edges }: { nodes: any[]; edges: Edge[] }) => {
          const flattenNds: any[] = [];
          nodes.forEach((node) => {
            flattenNode(node, flattenNds);
          });

          flattenNds.forEach((node) => {
            delete node.ports;
            delete node.x;
            delete node.y;
            delete node.edges;
            delete node.layoutOptions;
          });
          graphState.setNodes((nodes) => {
            const newNodes = nodes.map((node) => {
              const n = flattenNds.find((n) => n.id === node.id);
              if (n) {
                return { ...node, position: n.position };
              }
              return node;
            });
            return newNodes;
          });
          graphState.setNodes(flattenNds);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => {
                reactflowInstance.current?.fitView();
              });
            });
          });
        }
      );
    });
  }, []);

  const sourceCode = (): GenResult => {
    return pythonGenerator.programToCode(
      new VisualProgram(graphState.getNodes(), graphState.getEdges())
    );
  };

  const closeMenu = (): void => {
    gui.closeWidget();
  };

  return {
    gui,
    varsNamePool,
    funNamePool,
    anyConnectableNodeSelected: graphState.anyConnectableNodeSelected,
    anyConnectionToSelectedNode: graphState.anyConnectionToSelectedNode,
    extraCommands,
    sceneActions: {
      getNodeById: graphState.getNodeById,
      getSelectedCounts: graphState.getSelectedCounts,
      setSelectedCounts: graphState.setSelectedCounts,
      selectNode: graphState.selectNode,
      selectEdge: graphState.selectEdge,
      addNode,
      addNodeWithSceneCoord,
      addEdge: graphState.addEdge,
      setNodes: graphState.setNodes,
      setExtraCommands,
      selectAll: graphState.selectAll,
      clearEdgeSelection: graphState.clearEdgeSelection,
      getHandleConnectionCounts: graphState.getHandleConnectionCounts,
      onNodeDragStart,
      onNodeDragStop,
      copySelectedNodeToClipboard,
      pasteFromClipboard,
      clear: graphState.clear,
      deleteSelectedElements,
      duplicateSelectedNodes,
      cutSelectedNodesToClipboard,
      deleteEdge: graphState.deleteEdge,
      deleteAllEdgesOfNode: graphState.deleteAllEdgesOfNode,
      deleteAllEdgesOfHandle: graphState.deleteAllEdgesOfHandle,
      deleteAllEdgesOfSelectedNodes: graphState.deleteAllEdgesOfSelectedNodes,
      isValidConnection: graphState.isValidConnection,
      centerSelectedNodes,
      onNodesDelete,
      selectedNodes: graphState.selectedNodes,
      sortZIndexOfComments,
      autoLayout,
      deleteHandle,
      sourceCode,
      closeMenu,
    },
  };
}

// ref from https://reactflow.dev/docs/examples/layout/elkjs/
const elk = new ELK();
const layoutOptions = {
  algorithm: 'layered',
  edgeRouting: 'SPLINES',
  'layered.spacing.nodeNodeBetweenLayers': '48',
  'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',
  hierarchyHandling: 'INCLUDE_CHILDREN',
};

const getAlignedElements = (nodes: any, edges: any): any => {
  const elkNodes = nodes.map((node: any) => {
    const nodeRect = document
      .querySelector(`[data-id="${String(node.id)}"]`)
      ?.getBoundingClientRect();
    const scale = Number(nodeRect?.width) / Number(node?.width);
    const inputPorts = Object.keys(node.data.inputs ?? {}).map((key) => {
      const handleRect = document
        .querySelector(`[data-id="${String(node.id)}-${key}-target"]`)
        ?.getBoundingClientRect();
      return {
        id: 'p' + String(node.id) + String(key),
        x: ((handleRect?.x ?? 0) - (nodeRect?.x ?? 0)) / scale,
        y: ((handleRect?.y ?? 0) - (nodeRect?.y ?? 0)) / scale,
        height: Number(handleRect?.height) / scale ?? 20,
        width: Number(handleRect?.width) / scale ?? 16,
      };
    });
    const outputPorts = Object.keys(node.data.outputs ?? {}).map((key) => {
      const handleRect = document
        .querySelector(`[data-id="${String(node.id)}-${key}-source"]`)
        ?.getBoundingClientRect();
      return {
        id: 'p' + String(node.id) + String(key),
        x: ((handleRect?.x ?? 0) - (nodeRect?.x ?? 0)) / scale,
        y: ((handleRect?.y ?? 0) - (nodeRect?.y ?? 0)) / scale,
        height: Number(handleRect?.height) / scale ?? 20,
        width: Number(handleRect?.width) / scale ?? 16,
      };
    });
    return {
      ...node,
      ports: [...inputPorts, ...outputPorts],
      layoutOptions: { portConstraints: 'FIXED_POS' },
    };
  });
  const elkEdges = edges.map((edge: any) => ({
    id: edge.id,
    sources: ['p' + String(edge.source) + String(edge.sourceHandle)],
    targets: ['p' + String(edge.target) + String(edge.targetHandle)],
  }));

  const comments = elkNodes.filter((node: Node) => node.type === 'comment');
  const commentNodesInSizeOrderAsec = comments.sort(
    (a: Node, b: Node) =>
      (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0)
  );

  const rootNodes: any[] = [];
  elkNodes.forEach((node: any) => {
    node.parentId = undefined;
    for (const comment of commentNodesInSizeOrderAsec) {
      if (nodeInsideOfNode(node, comment)) {
        if (!comment.children) {
          comment.children = [];
        }
        comment.children.push(node);
        node.parentId = comment.id;
        break;
      }
    }
    if (node.parentId === undefined) {
      rootNodes.push(node);
    }
  });

  commentNodesInSizeOrderAsec.forEach((comment: any) => {
    if (!comment.children) return;
    delete comment.width;
    delete comment.height;
  });

  const graph = {
    id: 'root',
    children: rootNodes,
    edges: elkEdges,
    layoutOptions,
  };
  return elk
    .layout(graph, {
      layoutOptions: {
        'elk.padding': '[top=32.0,left=16.0,bottom=16.0,right=16.0]',
      },
    })
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children ?? [],
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

function flattenNode(
  node: any,
  nds: any[],
  parentPosition?: { x: number; y: number }
): void {
  node.position = {
    x: Number(node.x) + Number(parentPosition?.x ?? 0),
    y: Number(node.y) + Number(parentPosition?.y ?? 0),
  };

  if (node.type === 'comment') {
    node.data.width = node.width;
    node.data.height = node.height;
  }
  nds.push(node);
  if (node.children) {
    node.children.forEach((child: any) => {
      flattenNode(child, nds, { x: node.position.x, y: node.position.y });
    });
    delete node.children;
  }
}

function getNodeByIdIn(id: string, Nodes: Node[]): Node | undefined {
  for (const node of Nodes) {
    if (node.id === id) {
      return node;
    }
  }
  return undefined;
}
