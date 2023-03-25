import { type GraphData, type Node, type Edge } from '../types';
import {
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge as rcAddEdge,
  type NodeChange,
  type EdgeChange,
} from 'reactflow';
import { useCallback } from 'react';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export interface GraphState {
  nodes: Node[];
  getFreeUniqueNodeIds: (count: number) => string[];
  setNodes: (nodes: Node[]) => void;
  addNodes: (nodes: Node[]) => void;
  onNodesChange: OnChange<NodeChange>;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  addEdges: (edges: Edge[]) => void;
  onEdgesChange: OnChange<EdgeChange>;
  onConnect: (params: Connection) => void;
  selectedNodes: Node[];
  selectAll: (sure: boolean) => void;
  deleteSelectedNodes: () => void;
  deleteSelectedElements: () => void;
}
export default function useGraph(data: GraphData): GraphState {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => rcAddEdge(params, eds));
  }, []);

  const getFreeUniqueNodeIds = useCallback(
    (count: number): string[] => {
      const ids = nodes.map((n) => n.id);
      const newIds = [];
      let id = 0;
      while (newIds.length < count) {
        while (ids.includes(`${id}`)) {
          id++;
        }
        newIds.push(`${id}`);
        id++;
      }
      return newIds;
    },
    [nodes]
  );

  const addNodes = useCallback((newNodes: Node[]) => {
    setNodes((nds) => [...nds, ...newNodes]);
  }, []);

  const addEdges = useCallback((newEdges: Edge[]) => {
    setEdges((eds) => [...eds, ...newEdges]);
  }, []);

  const selectedNodes = nodes.filter((n) => n.selected);

  const selectAll = (sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  };

  const deleteSelectedNodes = (): void => {
    setNodes((nds) => nds.filter((n) => !n.selected));
  };

  const deleteSelectedElements = (): void => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  };

  return {
    getFreeUniqueNodeIds,
    nodes,
    setNodes,
    addNodes,
    onNodesChange,
    edges,
    setEdges,
    addEdges,
    onEdgesChange,
    onConnect,
    selectedNodes,
    selectAll,
    deleteSelectedNodes,
    deleteSelectedElements,
  };
}
