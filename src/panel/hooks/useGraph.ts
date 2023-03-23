import { type GraphData, type Node, type Edge } from '../types';
import {
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge,
  type NodeChange,
  type EdgeChange,
} from 'reactflow';
import { useCallback } from 'react';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export interface GraphState {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  onNodesChange: OnChange<NodeChange>;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: OnChange<EdgeChange>;
  onConnect: (params: Connection) => void;
  selectedNodes: Node[];
  selectAll: (sure: boolean) => void;
}
export default function useGraph(data: GraphData): GraphState {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);
  const selectedNodes = nodes.filter((n) => n.selected);
  const selectAll = (sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  };
  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    selectedNodes,
    selectAll,
  };
}
