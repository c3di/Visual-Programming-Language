import { useRef } from 'react';
import { type Node, type ClipboardInfo, isCommentNode } from '../types';
import { type GraphState } from './useGraph';

export interface SceneState {
  selectAll: (sure: boolean) => void;
  onNodeDragStart: (evt: any, node: Node) => void;
  onNodeDragStop: (evt: any, node: Node) => void;
  copySelectedNodeToClipboard: () => void;
}
export default function useScene(graphState: GraphState): SceneState {
  const { nodes, selectedNodes, edges } = graphState;
  const nodesRefInCommentNode = useRef({});
  const onNodeDragStart = (evt: any, node: Node): void => {
    nodes.forEach((node) => {
      saveNodesInSelectedCommentNode(node);
    });
  };

  const saveNodesInSelectedCommentNode = (node: Node): void => {
    if (!node?.selected || !isCommentNode(node.data)) return;
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
      isEmpty: true,
      nodes: {},
      edges: [],
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
    };
    selectedNodes.forEach((node) => {
      clipboard.nodes[node.id] = node;
      clipboard.minX = Math.min(clipboard.minX, node.position.x);
      clipboard.minY = Math.min(clipboard.minY, node.position.y);
    });
    clipboard.isEmpty = Object.keys(clipboard.nodes).length === 0;
    if (clipboard.isEmpty) return;
    clipboard.edges = edges.filter((edge) => {
      return clipboard.nodes[edge.source] && clipboard.nodes[edge.target];
    });
    const clipboardStr = JSON.stringify(clipboard);
    navigator.clipboard.writeText(clipboardStr).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return {
    selectAll: graphState.selectAll,
    onNodeDragStart,
    onNodeDragStop,
    copySelectedNodeToClipboard,
  };
}
