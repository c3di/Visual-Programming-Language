import {
  type Node,
  type Edge,
  type Graph,
  type SerializedGraph,
  type HandleData,
  type ConnectionStatus,
  type selectedElementsCounts,
  isDataTypeMatch,
  getMaxConnection,
  ConnectionAction,
} from '../types';
import {
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge as rcAddEdge,
  type NodeChange,
  type EdgeChange,
  type Node as RcNode,
  MarkerType,
  getConnectedEdges,
  getOutgoers,
  getIncomers,
  useReactFlow,
} from 'reactflow';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { serializer } from '../Serializer';
import { deserializer } from '../Deserializer';
import { deepCopy } from '../util';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export interface GraphState {
  initGraph: Graph;
  nodes: Node[];
  edges: Edge[];
  getFreeUniqueNodeIds: (count: number) => string[];
  getNodeById: (id: string) => Node | undefined;
  setNodes: Dispatch<SetStateAction<Array<RcNode<any, string | undefined>>>>;
  onNodesChange: OnChange<NodeChange>;
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: OnChange<EdgeChange>;
  onConnect: (params: Connection) => void;
  isValidConnection: (params: Connection) => ConnectionStatus;
  selectedNodes: () => Node[];
  getSelectedCounts: () => selectedElementsCounts;
  setSelectedCounts: (newCounts: selectedElementsCounts) => void;
  selectAll: (sure: boolean) => void;
  selectNode: (nodeId: string) => void;
  selectEdge: (edgeId: string) => void;
  clearEdgeSelection: () => void;
  clear: () => void;
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
  anyConnectionToSelectedNode: boolean;
  toString: () => string;
  fromJSON: (graph: SerializedGraph | undefined | null) => {
    nodes: Node[];
    edges: Edge[];
  };
}
export default function useGraph(graph?: SerializedGraph | null): GraphState {
  const initGraph = deserializer.deserialize(graph);
  const [nodes, setNodes, onNodesChange] = useNodesState(initGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initGraph.edges);
  const shouldUpdateDataTypeOfRerouteNode = useRef(false);
  const selectedCounts = useRef<selectedElementsCounts>({
    nodesCount: 0,
    edgesCount: 0,
  });
  // the nodes will added more properties by reactflow, so we need to get the nodes from reactflow
  const { getNodes, getNode, getEdges } = useReactFlow();

  const getNodeById = useCallback(
    (id: string): Node | undefined => {
      return nodes.find((n) => n.id === id);
    },
    [nodes]
  );

  const getSelectedCounts = useCallback((): selectedElementsCounts => {
    return selectedCounts.current;
  }, []);

  const setSelectedCounts = useCallback((newCounts: selectedElementsCounts) => {
    selectedCounts.current = newCounts;
  }, []);

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

  const setDataTypeOfGraph = useCallback(
    (nodeIds: string[], dataType: string) => {
      const edgeIds: string[] = [];
      setNodes((nds) => {
        const newNodes = nds.map((n) => {
          if (nodeIds.includes(n.id)) {
            const edges = getConnectedEdges([n], getEdges());
            edges.forEach((e) => {
              if (!edgeIds.includes(e.id)) edgeIds.push(e.id);
            });
            const { inputs, outputs } = n.data;
            if (inputs) {
              Object.values(inputs).forEach((input) => {
                (input as HandleData).dataType = dataType;
              });
            }
            if (outputs) {
              Object.values(outputs).forEach((output) => {
                (output as HandleData).dataType = dataType;
              });
            }
            n.data = {
              ...n.data,
              dataType,
              inputs,
              outputs,
            };
          }
          return n;
        });
        return newNodes;
      });
      setEdges((eds) => {
        const newEdges = eds.map((e) => {
          if (edgeIds.includes(e.id)) {
            e.data = {
              ...e.data,
              dataType,
            };
          }
          return e;
        });
        return newEdges;
      });
    },
    []
  );

  const graphIncludeNodeWithType = useCallback(
    (
      node: Node,
      type: string,
      dataType: string,
      visitedNodeIds: string[]
    ): void => {
      if (
        visitedNodeIds.includes(node.id) ||
        node.type !== type ||
        node.data.dataType !== dataType
      )
        return;
      visitedNodeIds.push(node.id);
      getIncomers(node, getNodes(), getEdges()).forEach((n) => {
        graphIncludeNodeWithType(n, type, dataType, visitedNodeIds);
      });
      getOutgoers(node, getNodes(), getEdges()).forEach((n) => {
        graphIncludeNodeWithType(n, type, dataType, visitedNodeIds);
      });
    },
    []
  );

  const setDataTypeInGraphWithRerouteNode = useCallback(
    (node: Node, dataType: string): void => {
      const visitedNode: string[] = [];
      graphIncludeNodeWithType(node, 'reroute', 'any', visitedNode);
      if (visitedNode.length === 0) return;
      setDataTypeOfGraph(visitedNode, dataType);
    },
    []
  );

  const updateDatatypeInGraph = useCallback((params: Connection): string => {
    const sourceHandle = getNode(params.source!)?.data.outputs?.[
      params.sourceHandle!
    ] as HandleData;
    const targetHandle = getNode(params.target!)?.data.inputs?.[
      params.targetHandle!
    ] as HandleData;
    let dataType = 'any';
    if (sourceHandle.dataType && sourceHandle.dataType !== 'any')
      if (targetHandle.dataType && targetHandle.dataType !== 'any')
        dataType = targetHandle.dataType;
      else {
        dataType = sourceHandle.dataType;
        setDataTypeInGraphWithRerouteNode(getNode(params.target!)!, dataType);
      }
    else {
      if (targetHandle.dataType && targetHandle.dataType !== 'any') {
        dataType = targetHandle.dataType;
        setDataTypeInGraphWithRerouteNode(getNode(params.source!)!, dataType);
      }
    }
    return dataType;
  }, []);

  const isConnectToNonRerouteNodes = useCallback(
    (node: Node, visited: string[] = []): boolean => {
      // traverse the graph including this node to check if the node is connected to non-reroute nodes
      if (visited.includes(node.id)) return false;
      let isConnected = node.type !== 'reroute';
      visited.push(node.id);
      if (isConnected) return isConnected;
      getIncomers(node, getNodes(), getEdges()).forEach((n) => {
        if (visited.includes(n.id)) return;
        isConnected = isConnectToNonRerouteNodes(n, visited) || isConnected;
      });
      getOutgoers(node, getNodes(), getEdges()).forEach((n) => {
        if (visited.includes(n.id)) return;
        isConnected = isConnectToNonRerouteNodes(n, visited) || isConnected;
      });
      return isConnected;
    },
    []
  );

  const resetRerouteNodeDataType = useCallback(() => {
    const StartRerouteNodeToReset: Node[] = [];
    const rerouteNodes = getNodes().filter(
      (n) => n.data.configType === 'reroute'
    );
    const allVisitedNodeIds: string[] = [];
    const subGraphs: string[][] = [];
    for (const n of rerouteNodes) {
      if (!allVisitedNodeIds.includes(n.id)) {
        const visitedNodeIds: string[] = [];
        if (!isConnectToNonRerouteNodes(n, visitedNodeIds)) {
          StartRerouteNodeToReset.push(n);
          subGraphs.push(visitedNodeIds);
        }
        allVisitedNodeIds.push(...visitedNodeIds);
      }
    }
    subGraphs.forEach((nodeIds) => {
      setDataTypeOfGraph(nodeIds, 'any');
    });
  }, []);

  const addEdge = useCallback((params: Connection) => {
    deleteEdgesIfReachMaxConnection(params);
    const dataType = updateDatatypeInGraph(params);
    setEdges((eds) =>
      rcAddEdge(
        {
          ...params,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: {
            dataType,
          },
        },
        eds
      )
    );
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
      shouldUpdateDataTypeOfRerouteNode.current = true;
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

  const clear = useCallback((): void => {
    setNodes([]);
    setEdges([]);
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
    shouldUpdateDataTypeOfRerouteNode.current = true;
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
      deleteEdges(
        (e) =>
          (e.source === nodeId && e.sourceHandle === handleId) ||
          (e.target === nodeId && e.targetHandle === handleId)
      );
    },
    []
  );

  const isValidConnection = useCallback(
    (params: Connection): ConnectionStatus => {
      if (params.source === params.target)
        return {
          action: ConnectionAction.Reject,
          message: 'Both are on the same node.',
        };
      const sourceNode = getNode(params.source!);
      const targetNode = getNode(params.target!);
      const sourceHandle = sourceNode?.data.outputs?.[params.sourceHandle!];
      const targetHandle = targetNode?.data.inputs?.[params.targetHandle!];
      if (!sourceHandle || !targetHandle)
        return {
          action: ConnectionAction.Reject,
          message: 'Directions are not compatible.',
        };
      if (!isDataTypeMatch(sourceHandle.dataType, targetHandle.dataType))
        return {
          action: ConnectionAction.Reject,
          message: 'Types are not compatible.',
        };
      if (
        sourceHandle.connection ===
          getMaxConnection('source', sourceHandle.dataType) ||
        targetHandle.connection ===
          getMaxConnection('target', targetHandle.dataType)
      )
        return {
          action: ConnectionAction.Replace,
          message: 'Replace the existing connection.',
        };
      return {
        action: ConnectionAction.Allowed,
      };
    },
    []
  );

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

  const toString = useCallback((): string => {
    if (getNodes().length === 0) return '';
    const graph = serializer.serialize({
      nodes: deepCopy(getNodes()),
      edges: deepCopy(getEdges()),
    });
    return JSON.stringify(graph);
  }, []);

  const fromJSON = useCallback(
    (
      graph: SerializedGraph | undefined | null
    ): { nodes: Node[]; edges: Edge[] } => {
      const { nodes, edges } = deserializer.deserialize(graph);
      setNodes(nodes);
      setEdges(edges);
      return { nodes, edges };
    },
    []
  );

  const [anyConnectableNodeSelected, setAnyConnectableNodeSelected] =
    useState(false);
  useEffect(() => {
    setAnyConnectableNodeSelected(isAnyConnectableNodeSelected());
  }, [nodes]);

  const [anyConnectionToSelectedNode, setAnyConnectionToSelectedNode] =
    useState(false);
  useEffect(() => {
    for (const n of selectedNodes()) {
      for (const handle of Object.values({
        ...(n.data.inputs ?? {}),
        ...(n.data.outputs ?? {}),
      })) {
        if ((handle as HandleData).connection) {
          setAnyConnectionToSelectedNode(true);
          return;
        }
      }
    }
    setAnyConnectionToSelectedNode(false);
  }, [nodes]);

  useEffect(() => {
    if (shouldUpdateDataTypeOfRerouteNode.current) {
      resetRerouteNodeDataType();
      shouldUpdateDataTypeOfRerouteNode.current = false;
    }
  }, [nodes, edges]);

  return {
    initGraph,
    getFreeUniqueNodeIds,
    nodes,
    getNodeById,
    setNodes,
    onNodesChange,
    edges,
    getSelectedCounts,
    setSelectedCounts,
    setEdges,
    onEdgesChange,
    onConnect,
    isValidConnection,
    selectedNodes,
    selectAll,
    selectNode,
    selectEdge,
    clearEdgeSelection,
    clear,
    deleteSelectedNodes,
    deleteSelectedElements,
    deleteAllEdgesOfSelectedNodes,
    deleteEdge,
    deleteAllEdgesOfNode,
    deleteAllEdgesOfHandle,
    addElements,
    getHandleConnectionCounts,
    anyConnectableNodeSelected,
    anyConnectionToSelectedNode,
    toString,
    fromJSON,
  };
}
