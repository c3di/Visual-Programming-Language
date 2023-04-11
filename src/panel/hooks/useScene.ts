import { useCallback, useRef, useState } from 'react';
import {
  type Node,
  type ClipboardInfo,
  isCommentNode,
  type ConnectionStatus,
  type Edge,
} from '../types';
import { type GraphState } from './useGraph';
import { deserializer } from '../Deserializer';
import { type Command } from './useGui';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { useReactFlow, getRectOfNodes, type XYPosition } from 'reactflow';

export interface SceneState {
  selectAll: (sure: boolean) => void;
  selectEdge: (edgeId: string) => void;
  selectNode: (nodeId: string) => void;
  addNode: (configType: string, thisPosition?: XYPosition) => Node;
  addEdge: (
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string,
    dataType?: string
  ) => void;
  clearEdgeSelection: () => void;
  getHandleConnectionCounts: (nodeId: string, handleId: string) => number;
  onNodeDragStart: (evt: any, node: Node) => void;
  onNodeDragStop: (evt: any, node: Node) => void;
  copySelectedNodeToClipboard: () => void;
  pasteFromClipboard: () => void;
  deleteSelectedElements: () => void;
  duplicateSelectedNodes: () => void;
  cutSelectedNodesToClipboard: () => void;
  deleteEdge: (id: string) => void;
  deleteAllEdgesOfNode: (nodeId: string) => void;
  deleteAllEdgesOfHandle: (nodeId: string, handleId: string) => void;
  deleteAllEdgesOfSelectedNodes: () => void;
  isValidConnection: (params: any) => ConnectionStatus;
  anyConnectableNodeSelected: boolean;
  anyConnectionToSelectedNode: boolean;
  extraCommands: Command[];
  centerSelectedNodes: () => void;
}
export default function useScene(
  graphState: GraphState,
  mousePos: React.MutableRefObject<{
    mouseX: number;
    mouseY: number;
  }>
): SceneState {
  const { nodes, selectedNodes, edges, getFreeUniqueNodeIds } = graphState;
  const nodesRefInCommentNode = useRef({});
  const [extraCommands, setExtraCommands] = useState<Command[]>([]);
  const { setCenter, getZoom } = useReactFlow();
  const onNodeDragStart = (evt: any, node: Node): void => {
    nodes.forEach((node) => {
      saveNodesInSelectedCommentNode(node, node.id);
    });
  };

  const saveNodesInSelectedCommentNode = (
    node: Node,
    toBeDragNodeId: string
  ): void => {
    if (
      !isCommentNode(node.data) ||
      (!node?.selected && node.id !== toBeDragNodeId)
    )
      return;
    const nodesInComment = nodes.filter(
      (n) =>
        !n.selected &&
        n.position.x > node.position.x &&
        n.position.x + (n.width ?? 0) < node.position.x + (node.width ?? 0) &&
        n.position.y > node.position.y &&
        n.position.y + (n.height ?? 0) < node.position.y + (node.height ?? 0) &&
        n.id !== node.id
    );
    if (!nodesInComment) return;
    nodesRefInCommentNode.current = {
      ...nodesRefInCommentNode.current,
      [node.id]: nodesInComment,
    };
    // map to local coordinate
    nodesInComment.forEach((part, index, nodes) => {
      const n = nodes[index];
      n.position = {
        x: n.position.x - node.position.x,
        y: n.position.y - node.position.y,
      };
      n.parentNode = node.id;
    });
  };

  const clearNodesInSelectedCommentNode = (node: Node): void => {
    if (!node || !isCommentNode(node.data)) return;
    if (!nodesRefInCommentNode.current) return;
    const nodesInComment = (nodesRefInCommentNode.current as any)[`${node.id}`];
    if (!nodesInComment) return;
    nodesInComment.forEach((part: any, index: number, nodes: Node[]) => {
      const n = nodes[index];
      n.position = {
        x: n.position.x + node.position.x,
        y: n.position.y + node.position.y,
      };
      n.parentNode = undefined;
    });
    nodesRefInCommentNode.current = {};
  };

  const onNodeDragStop = (evt: any, node: Node): void => {
    nodes.forEach((node) => {
      clearNodesInSelectedCommentNode(node);
    });
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

  const pasteFromClipboard = (): void => {
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
                node.position.x - clipboard.minX + mousePos.current.mouseX + 10,
              y:
                node.position.y - clipboard.minY + mousePos.current.mouseY + 10,
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

  const duplicateSelectedNodes = (): void => {
    copySelectedNodeToClipboard();
    pasteFromClipboard();
  };

  const cutSelectedNodesToClipboard = (): void => {
    copySelectedNodeToClipboard();
    graphState.deleteSelectedNodes();
  };

  const addNode = useCallback(
    (configType: string, thisPosition?: XYPosition): Node => {
      const id = getFreeUniqueNodeIds(1)[0];
      const position = thisPosition ?? {
        x: mousePos.current.mouseX,
        y: mousePos.current.mouseY,
      };

      const config = deserializer.serializedToGraphNodeConfig({
        id,
        type: configType,
        position,
      });
      const node = deserializer.configToNode(config);
      graphState.addElements({ newNodes: [node] });
      return node;
    },
    []
  );

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

  return {
    selectNode: graphState.selectNode,
    selectEdge: graphState.selectEdge,
    addNode,
    addEdge,
    selectAll: graphState.selectAll,
    clearEdgeSelection: graphState.clearEdgeSelection,
    getHandleConnectionCounts: graphState.getHandleConnectionCounts,
    onNodeDragStart,
    onNodeDragStop,
    copySelectedNodeToClipboard,
    pasteFromClipboard,
    deleteSelectedElements: graphState.deleteSelectedElements,
    duplicateSelectedNodes,
    cutSelectedNodesToClipboard,
    deleteEdge: graphState.deleteEdge,
    deleteAllEdgesOfNode: graphState.deleteAllEdgesOfNode,
    deleteAllEdgesOfHandle: graphState.deleteAllEdgesOfHandle,
    deleteAllEdgesOfSelectedNodes: graphState.deleteAllEdgesOfSelectedNodes,
    isValidConnection: graphState.isValidConnection,
    anyConnectableNodeSelected: graphState.anyConnectableNodeSelected,
    anyConnectionToSelectedNode: graphState.anyConnectionToSelectedNode,
    extraCommands,
    centerSelectedNodes,
  };
}
