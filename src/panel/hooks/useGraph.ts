import {
  type Node,
  type Edge,
  isDataTypeMatch,
  getMaxConnection,
  type SerializedGraph,
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
import { useCallback, useEffect, useState } from 'react';
import { serializer } from '../Serializer';
import { deserializer } from '../Deserializer';

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
  selectNode: (nodeId: string) => void;
  selectEdge: (edgeId: string) => void;
  clearEdgeSelection: () => void;
  deleteSelectedNodes: () => void;
  deleteSelectedElements: () => void;
  deleteEdge: (id: string) => void;
  deleteAllEdgesOfNode: (nodeId: string) => void;
  deleteAllEdgesOfSelectedNodes: () => void;
  deleteAllEdgesOfHandle: (nodeId: string, handleId: string) => void;
  addElements: ({
    newNodes,
    newEdges,
  }: {
    newNodes?: Node[];
    newEdges?: Edge[];
  }) => void;
  getHandleConnectionCounts: (nodeId: string, handleId: string) => number;
  anyConnectableNodeSelected: boolean;
  toJSON: () => string;
  fromJSON: (graph: SerializedGraph) => void;
}
export default function useGraph(
  graph: SerializedGraph | undefined
): GraphState {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // the nodes will added more properties by reactflow, so we need to get the nodes from reactflow
  const { getNodes, getNode, getEdges } = useReactFlow();
  const updateHandleConnection = useCallback(
    (
      nodeId: string | null,
      handleId: string | null | undefined,
      connected: boolean,
      isSource: boolean
    ): void => {
      if (!nodeId || !handleId) return;
      const node = getNode(nodeId);
      if (!node) return;
      const handle = isSource
        ? node.data.outputs?.[handleId]
        : node.data.inputs?.[handleId];
      if (!handle) return;
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

  const addElements = useCallback(
    ({ newNodes, newEdges }: { newNodes?: Node[]; newEdges?: Edge[] }) => {
      if (newNodes?.length) setNodes((nds) => [...nds, ...newNodes]);
      if (newEdges?.length) setEdges((eds) => [...eds, ...newEdges]);
    },
    []
  );

  const selectedNodes = useCallback(() => {
    return getNodes().filter((n) => n.selected);
  }, []);

  const selectEdge = useCallback((edgeId: string): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: e.id === edgeId })));
  }, []);

  const clearEdgeSelection = useCallback((): void => {
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
  }, []);

  const selectAll = useCallback((sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  }, []);

  const selectNode = useCallback((nodeId: string): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === nodeId })));
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

  const deleteAllEdgesOfSelectedNodes = useCallback((): void => {
    const selectedNodesIds = selectedNodes().map((n) => n.id);
    selectedNodesIds.forEach((id) => {
      deleteAllEdgesOfNode(id);
    });
  }, []);

  const deleteAllEdgesOfHandle = useCallback(
    (nodeId: string, handleId: string): void => {
      console.log('deleteAllEdgesOfHandle', nodeId, handleId);
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
    if (!isDataTypeMatch(sourceHandle.dataType, targetHandle.dataType)) {
      console.log('source and target handle type do not match');
      return false;
    }
    return true;
  }, []);

  const getHandleConnectionCounts = useCallback(
    (nodeId: string, handleId: string) => {
      const node = getNode(nodeId);
      if (!node) {
        console.log('no node found');
        return null;
      }
      const handle =
        node.data.inputs?.[handleId] ?? node.data.outputs?.[handleId];
      if (!handle) {
        console.log('no handle found');
        return null;
      }
      return handle.connection;
    },
    []
  );

  const isAnyConnectableNodeSelected = useCallback((): boolean => {
    return (
      getNodes().find((n) => n.selected && n.data.inputs && n.data.outputs) !==
      undefined
    );
  }, []);

  const toJSON = useCallback((): string => {
    const graph = serializer.serialize({
      nodes: getNodes(),
      edges: getEdges(),
    });
    return JSON.stringify(graph);
  }, []);

  const fromJSON = useCallback((graph: SerializedGraph | undefined): void => {
    const { nodes, edges } = deserializer.deserialize(graph);
    setNodes(nodes);
    setEdges(edges);
  }, []);

  useEffect(() => {
    if (graph) fromJSON(graph);
  }, []);

  const [anyConnectableNodeSelected, setAnyConnectableNodeSelected] =
    useState(false);
  useEffect(() => {
    setAnyConnectableNodeSelected(isAnyConnectableNodeSelected());
  }, [nodes]);

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
    selectNode,
    selectEdge,
    clearEdgeSelection,
    deleteSelectedNodes,
    deleteSelectedElements,
    deleteAllEdgesOfSelectedNodes,
    deleteEdge,
    deleteAllEdgesOfNode,
    deleteAllEdgesOfHandle,
    addElements,
    getHandleConnectionCounts,
    anyConnectableNodeSelected,
    toJSON,
    fromJSON,
  };
}
