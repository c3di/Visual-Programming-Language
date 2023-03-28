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
  edges: Edge[];
  getFreeUniqueNodeIds: (count: number) => string[];
  setNodes: (nodes: Node[]) => void;
  onNodesChange: OnChange<NodeChange>;
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: OnChange<EdgeChange>;
  onConnect: (params: Connection) => void;
  selectedNodes: () => Node[];
  selectAll: (sure: boolean) => void;
  deleteSelectedNodes: () => void;
  deleteSelectedElements: () => void;
  deleteEdge: (id: string) => void;
  deleteAllEdgesOfNode: (nodeId: string) => void;
  deleteAllEdgesOfHandle: (nodeId: string, handleId: string) => void;
  pasteElements: (newNodes: Node[], newEdges: Edge[]) => void;
}
export default function useGraph(data: GraphData): GraphState {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);

  const updateHandleConnection = (
    nodeId: string | null,
    handleId: string | null | undefined,
    connected: boolean,
    isSource: boolean
  ): void => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      return;
    }
    if (!handleId) {
      return;
    }

    const handle = isSource
      ? node.data.outputs?.[handleId]
      : node.data.inputs?.[handleId];
    if (!handle) {
      return;
    }
    handle.connection = Number(handle.connection ?? 0) + (connected ? 1 : -1);

    setNodes(
      nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
          };
        }
        return node;
      })
    );
  };

  const onConnect = useCallback((params: Connection) => {
    addEdge(params);
  }, []);

  const addEdge = useCallback((params: Connection) => {
    setEdges((eds) => rcAddEdge(params, eds));
    updateHandleConnection(params.source, params.sourceHandle, true, true);
    updateHandleConnection(params.target, params.targetHandle, true, false);
  }, []);

  const deleteEdges = useCallback(
    (delEdgeSelctor: (e: Edge) => boolean): void => {
      const toBeDel = edges.filter((e) => delEdgeSelctor(e));
      if (!toBeDel) {
        return;
      }
      toBeDel.forEach((e) => {
        updateHandleConnection(e.source, e.sourceHandle, false, true);
        updateHandleConnection(e.target, e.targetHandle, false, false);
      });
      setEdges((eds) => eds.filter((e) => !delEdgeSelctor(e)));
    },
    []
  );

  const deleteEdge = (id: string): void => {
    deleteEdges((e) => e.id === id);
  };

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

  const pasteElements = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, []);

  const selectedNodes = useCallback(() => {
    return nodes.filter((n) => n.selected);
  }, []);

  const selectAll = useCallback((sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  }, []);

  const deleteSelectedNodes = useCallback((): void => {
    deleteEdges((e) => {
      const selectedNodesId = nodes.filter((n) => n.selected).map((n) => n.id);
      return (
        selectedNodesId.includes(e.source) || selectedNodesId.includes(e.target)
      );
    });
    setNodes((nds) => nds.filter((n) => !n.selected));
  }, []);

  const deleteSelectedElements = useCallback((): void => {
    deleteEdges((e) => e.selected ?? false);
    deleteSelectedNodes();
  }, []);

  const deleteAllEdgesOfNode = useCallback((nodeId: string): void => {
    deleteEdges((e) => e.source === nodeId || e.target === nodeId);
  }, []);

  const deleteAllEdgesOfHandle = useCallback(
    (nodeId: string, handleId: string): void => {
      deleteEdges(
        (e) =>
          (e.source === nodeId && e.sourceHandle === handleId) ||
          (e.target === nodeId && e.targetHandle === handleId)
      );
    },
    []
  );

  return {
    getFreeUniqueNodeIds,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    selectedNodes,
    selectAll,
    deleteSelectedNodes,
    deleteSelectedElements,
    deleteEdge,
    deleteAllEdgesOfNode,
    deleteAllEdgesOfHandle,
    pasteElements,
  };
}
