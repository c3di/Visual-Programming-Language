import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  type Node,
  type ClipboardInfo,
  type ConnectionStatus,
  type Edge,
  type selectedElementsCounts,
  isCommentNode,
  type Graph,
} from '../types';
import { type GraphState } from './useGraph';
import { deserializer } from '../Deserializer';
import useGui, { type IGui, type Command } from './useGui';
import ContentPaste from '@mui/icons-material/ContentPaste';
import {
  useReactFlow,
  getRectOfNodes,
  type XYPosition,
  type Node as RcNode,
} from 'reactflow';
import { UniqueNamePool, type IUniqueNamePool } from '../utils';

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

function sortZIndexOfComments(nodes: Node[]): Node[] {
  const selectedCommentNodes = nodes.filter((n) => isCommentNode(n.data));
  const nodesInSizeAsec = selectedCommentNodes.sort((a, b) => {
    return (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0);
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

export interface ISceneActions {
  getSelectedCounts: () => selectedElementsCounts;
  setSelectedCounts: (newCounts: selectedElementsCounts) => void;
  selectAll: (sure: boolean) => void;
  selectEdge: (edgeId: string) => void;
  selectNode: (nodeId: string) => void;
  getNodeById: (nodeId: string) => Node | undefined;
  addNode: (configType: string, thisPosition?: XYPosition, data?: any) => Node;
  addEdge: (
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string,
    dataType?: string
  ) => void;
  setNodes: Dispatch<SetStateAction<Array<RcNode<any, string | undefined>>>>;
  setExtraCommands: Dispatch<SetStateAction<Command[]>>;
  clearEdgeSelection: () => void;
  getHandleConnectionCounts: (nodeId: string, handleId: string) => number;
  onNodeDragStart: (evt: any, node: Node) => void;
  onNodeDragStop: (evt: any, node: Node) => void;
  copySelectedNodeToClipboard: () => void;
  pasteFromClipboard: (notUseMousePos?: boolean) => void;
  deleteSelectedElements: () => void;
  duplicateSelectedNodes: (notUseMousePos?: boolean) => void;
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
}
export interface ISceneState {
  gui: IGui;
  graphStateRef: React.MutableRefObject<GraphState>;
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
  }>
): ISceneState {
  const graphStateRef = useRef(graphState);
  const { selectedNodes, edges, getFreeUniqueNodeIds } = graphState;
  const [extraCommands, setExtraCommands] = useState<Command[]>([]);
  const { setCenter, getZoom, getNodes, setNodes } = useReactFlow();
  const varsNamePool = useRef<IUniqueNamePool>(new UniqueNamePool());
  const funNamePool = useRef<IUniqueNamePool>(new UniqueNamePool());

  const gui = useGui();
  const saveNodesInSelectedCommentNode = (node: Node): void => {
    const nodes = getNodes();
    nodes.forEach((n) => {
      if (n.id === node.id && !n.selected) {
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

    setNodes(nodes);
  };

  const clearNodesInSelectedCommentNode = (node: Node): void => {
    const nodes = getNodes();
    nodes.forEach((node) => {
      if (node.parentNode) {
        const parentNode = nodes.find((n) => n.id === node.parentNode) as Node;
        node.position.x += parentNode.position.x;
        node.position.y += parentNode.position.y;
        node.parentNode = undefined;
      }
    });
    sortZIndexOfComments(nodes);
    setNodes(nodes);
  };

  const onNodeDragStart = (evt: any, node: Node): void => {
    saveNodesInSelectedCommentNode(node);
  };

  const onNodeDragStop = (evt: any, node: Node): void => {
    clearNodesInSelectedCommentNode(node);
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
      clipboard.nodes[node.id] = node;
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
          return [
            ...commands,
            {
              name: 'Paste',
              action: pasteFromClipboard,
              labelIcon: ContentPaste,
              labelInfo: 'Ctrl+V',
              tooltip: 'Paste from the clipboard',
            },
          ];
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const pasteFromClipboard = (notUseMousePos?: boolean): void => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const clipboard: ClipboardInfo = JSON.parse(text);
        if (!clipboard?.hasNodes) return;
        const newNodes: Record<string, Node> = {};
        const newIds = getFreeUniqueNodeIds(
          Object.keys(clipboard.nodes).length
        );
        Object.keys(clipboard.nodes).forEach((id) => {
          const node = clipboard.nodes[id];
          const newId = newIds.shift();
          const newNode = {
            ...node,
            id: newId,
            selected: true,
            position: {
              x:
                node.position.x -
                Number(!notUseMousePos) *
                  (clipboard.minX - mousePos.current.mouseX) +
                10,
              y:
                node.position.y -
                Number(!notUseMousePos) *
                  (clipboard.minY - mousePos.current.mouseY) +
                10,
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
        graphState.selectAll(false);
        graphState.addElements({
          newNodes: Object.values(newNodes),
          newEdges,
        });
      })
      .catch((err) => {
        console.error('Failed to paste: ', err);
      });
  };

  const duplicateSelectedNodes = (notUseMousePos?: boolean): void => {
    copySelectedNodeToClipboard();
    pasteFromClipboard(notUseMousePos);
  };

  const cutSelectedNodesToClipboard = (): void => {
    copySelectedNodeToClipboard();
    graphState.deleteSelectedNodes();
  };

  const addNode = useCallback(
    (configType: string, thisPosition?: XYPosition, data?: any): Node => {
      const id = getFreeUniqueNodeIds(1)[0];
      const position = thisPosition ?? {
        x: mousePos.current.mouseX,
        y: mousePos.current.mouseY,
      };

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

  const onNodeAdd = (node: Node): void => {
    if (node.type === 'createVariable') {
      setExtraCommands((commands) => {
        if (
          !node.data.inputs.name.value &&
          !node.data.inputs.name.defaultValue
        ) {
          node.data.inputs.name.defaultValue =
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
              e: React.MouseEvent<HTMLLIElement> | undefined
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
              const latest = graphState.getNodeById(node.id)!;
              Object.values(latest.data.outputs).forEach((output: any) => {
                output.showWidget = false;
                output.showTitle = output.dataType !== 'exec';
                output.connection = 0;
              });
              const outputs: Record<string, any> = {
                functionCallExecOut: {
                  title: 'functionCallExecOut',
                  dataType: 'exec',
                  showWidget: false,
                  showTitle: false,
                },
              };
              const returnNodeId = latest?.data?.nodeRef;
              const returnNode = graphState.getNodeById(returnNodeId);
              Object.keys(returnNode?.data.inputs ?? {}).forEach(
                (name: string) => {
                  const input = returnNode!.data.inputs[name];
                  if (input.dataType === 'exec') return;
                  input.showWidget = false;
                  input.showTitle = true;
                  input.connection = 0;
                  outputs[name] = input;
                }
              );

              addNode('extension2.functionCall', undefined, {
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
      let nds = getNodes();
      nds.push(node);
      nds = sortZIndexOfComments(nds);
      setNodes(nds.filter((n) => n.id !== node.id));
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

  const addEdge = useCallback(
    (
      inputId: string,
      inputHandle: string,
      outputId: string,
      outputHandle: string,
      dataType?: string
    ): Edge => {
      const id = `e${inputId}-${inputHandle}-${outputId}-${outputHandle}`;
      const edge = deserializer.configToEdge({
        id,
        input: inputId,
        inputHandle,
        output: outputId,
        outputHandle,
        dataType,
      });
      graphState.addElements({ newEdges: [edge] });
      return edge;
    },
    []
  );

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

  return {
    gui,
    varsNamePool,
    funNamePool,
    graphStateRef,
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
      addEdge,
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
    },
  };
}
