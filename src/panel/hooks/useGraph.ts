import { type GraphData } from '../types';
import {
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge,
} from 'reactflow';
import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useGraph(data: GraphData) {
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
