import {
  type GraphData,
  type Node,
  type Edge,
  isDataTypeMatch,
  getMaxConnection,
} from '../types';
import {
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge as rcAddEdge,
  type NodeChange,
  type EdgeChange,
  useReactFlow,
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
  isValidConnection: (params: Connection) => boolean;
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
  // the nodes will added more properties by reactflow, so we need to get the nodes from reactflow
  const { getNodes, getNode, getEdges } = useReactFlow();
  const updateHandleConnection = useCallback(
    (
      nodeId: string | null,
      handleId: string | null | undefined,
      connected: boolean,
      isSource: boolean
    ): void => {
      if (!nodeId) {
        return;
      }
      const node = getNode(nodeId);
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

      setNodes((nds) => {
        const newNodes = nds.map((n) => {
          if (n.id === nodeId) {
            n.data = {
              ...n.data,
            };
          }
          return n;
        });
        return newNodes;
      });
    },
    []
  );

  const onConnect = useCallback((params: Connection) => {
    addEdge(params);
  }, []);

  const deleteEdgesIfReachMaxConnection = useCallback(
    (params: Connection): void => {
      const { source, sourceHandle, target, targetHandle } = params;
      if (!source || !sourceHandle || !target || !targetHandle) return;
      const sHandle = getNode(source)?.data.outputs?.[sourceHandle];
      const tHandle = getNode(target)?.data.inputs?.[targetHandle];
      if (!sHandle || !tHandle) return;
      if (sHandle.connection === getMaxConnection('source', sHandle.type)) {
        deleteAllEdgesOfHandle(source, sourceHandle);
      }
      if (tHandle.connection === getMaxConnection('target', tHandle.type)) {
        deleteAllEdgesOfHandle(target, targetHandle);
      }
    },
    []
  );

  const addEdge = useCallback((params: Connection) => {
    deleteEdgesIfReachMaxConnection(params);
    setEdges((eds) => rcAddEdge(params, eds));
    updateHandleConnection(params.source, params.sourceHandle, true, true);
    updateHandleConnection(params.target, params.targetHandle, true, false);
  }, []);

  const deleteEdges = useCallback(
    (delEdgeSelctor: (e: Edge) => boolean): void => {
      const toBeDel = getEdges().filter((e) => delEdgeSelctor(e));
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
      const ids = getNodes().map((n) => n.id);
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
    return getNodes().filter((n) => n.selected);
  }, []);

  const selectAll = useCallback((sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  }, []);

  const deleteSelectedNodes = useCallback((): void => {
    deleteEdges((e) => {
      const selectedNodesId = getNodes()
        .filter((n) => n.selected)
        .map((n) => n.id);
      return (
        selectedNodesId.includes(e.source) || selectedNodesId.includes(e.target)
      );
    });
    setNodes((nds) => nds.filter((n) => !n.selected));
  }, []);

  const deleteSelectedElements = useCallback((): void => {
    if (getEdges().find((e) => e.selected) !== undefined)
      deleteEdges((e) => e.selected ?? false);
    if (getNodes().find((n) => n.selected) !== undefined) deleteSelectedNodes();
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

  const isValidConnection = useCallback((params: Connection): boolean => {
    if (!params.source || !params.target) {
      console.log('no source or target in connection');
      return false;
    }
    const sourceNode = getNode(params.source);
    const targetNode = getNode(params.target);
    if (!sourceNode || !targetNode) {
      console.log('no source or target node found');
      return false;
    }
    if (!params.sourceHandle || !params.targetHandle) {
      console.log('no source or target handle in connection');
      return false;
    }
    const sourceHandle = sourceNode.data.outputs?.[params.sourceHandle];
    const targetHandle = targetNode.data.inputs?.[params.targetHandle];
    if (!sourceHandle || !targetHandle) {
      console.log('no source or target handle found');
      return false;
    }
    if (isDataTypeMatch(sourceHandle.type, targetHandle.type)) {
      console.log('source and target handle type do not match');
      return false;
    }
    return true;
  }, []);

  return {
    getFreeUniqueNodeIds,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    isValidConnection,
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
