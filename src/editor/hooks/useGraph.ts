import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  MarkerType,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  addEdge as rcAddEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type Node as RcNode,
} from 'reactflow';
import { deserializer } from '../Deserializer';
import { serializer } from '../Serializer';
import {
  ConnectionAction,
  DataTypes,
  getMaxConnection,
  isDataTypeMatch,
  type ConnectionStatus,
  type Edge,
  type Graph,
  type HandleData,
  type Node,
  type SerializedGraph,
  type selectedElementsCounts,
} from '../types';
import { deepCopy } from '../util';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export interface GraphState {
  initGraph: Graph;
  nodes: Node[];
  edges: Edge[];
  getNodes: () => Node[];
  getEdges: () => Edge[];
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
  deleteNodes: (nodeIds: string[]) => void;
  deleteSelectedNodes: () => void;
  deleteSelectedElements: () => void;
  deleteEdge: (id: string) => void;
  deleteAllEdgesOfNode: (nodeId: string) => void;
  deleteAllEdgesOfSelectedNodes: () => void;
  deleteAllEdgesOfHandle: (nodeId: string, handleId: string) => void;
  findFunctionCallNodes: (
    startNode: Node,
    functionCallNodes: Node[],
    visitedNodeIds: string[]
  ) => void;
  addElements: ({
    newNodes,
    newEdges,
  }: {
    newNodes?: Node[];
    newEdges?: Edge[];
  }) => void;
  addEdge: (params: Connection) => void;
  getHandle: (nodeId: string, handleId: string) => HandleData | undefined;
  getHandleConnectionCounts: (nodeId: string, handleId: string) => number;
  anyConnectableNodeSelected: boolean;
  anyConnectionToSelectedNode: boolean;
  toJSONString: () => string;
  fromSerializedGraph: (graph: SerializedGraph | undefined | null) => {
    nodes: Node[];
    edges: Edge[];
  };
  getConnectedInfo: (
    nodeId: string,
    handleId: string
  ) => { nodes: Node[]; edges: Edge[]; connectedHandlesId: string[] };
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

  const getNodeById = useCallback((id: string): Node | undefined => {
    return getNodes().find((n) => n.id === id);
  }, []);

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
      if (sHandle.connection === getMaxConnection('source', sHandle.dataType)) {
        deleteAllEdgesOfHandle(source, sourceHandle);
      }
      if (tHandle.connection === getMaxConnection('target', tHandle.dataType)) {
        deleteAllEdgesOfHandle(target, targetHandle);
      }
    },
    []
  );

  const setDataTypeOfGraph = useCallback(
    (nodeIds: string[], dataType: string | string[], defaultValue?: any) => {
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
                if (defaultValue)
                  (input as HandleData).defaultValue = defaultValue;
              });
            }
            if (outputs) {
              Object.values(outputs).forEach((output) => {
                (output as HandleData).dataType = dataType;
                if (defaultValue)
                  (output as HandleData).defaultValue = defaultValue;
              });
            }
            n = {
              ...n,
              data: {
                ...n.data,
                dataType,
                inputs,
                outputs,
              },
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
    [setNodes, nodes]
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
    (node: Node, dataType: string | string[], defaultValue?: any): void => {
      const visitedNode: string[] = [];
      graphIncludeNodeWithType(node, 'reroute', 'any', visitedNode);
      if (visitedNode.length === 0) return;
      setDataTypeOfGraph(visitedNode, dataType, defaultValue);
    },
    []
  );

  const updateDatatypeInGraph = useCallback(
    (params: Connection): string | string[] => {
      const sourceHandle = getNode(params.source!)?.data.outputs?.[
        params.sourceHandle!
      ] as HandleData;
      const targetHandle = getNode(params.target!)?.data.inputs?.[
        params.targetHandle!
      ] as HandleData;
      let dataType: string | string[] = 'any';
      if (sourceHandle.dataType && sourceHandle.dataType !== 'any')
        if (targetHandle.dataType && targetHandle.dataType !== 'any')
          dataType = targetHandle.dataType;
        else {
          dataType = sourceHandle.dataType;
          const defaultValue = dataType.includes('image')
            ? sourceHandle.defaultValue
            : undefined;
          setDataTypeInGraphWithRerouteNode(
            getNode(params.target!)!,
            dataType,
            defaultValue
          );
        }
      else {
        if (targetHandle.dataType && targetHandle.dataType !== 'any') {
          dataType = targetHandle.dataType;
          const defaultValue = dataType.includes('image')
            ? sourceHandle.defaultValue
            : undefined;
          setDataTypeInGraphWithRerouteNode(
            getNode(params.source!)!,
            dataType,
            defaultValue
          );
        }
      }
      return dataType;
    },
    []
  );

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
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        subGraphs.forEach((nodeIds) => {
          setDataTypeOfGraph(nodeIds, 'any', '');
        });
      });
    });
  }, []);

  const addEdge = useCallback((params: Connection) => {
    deleteEdgesIfReachMaxConnection(params);
    const dataType = updateDatatypeInGraph(params);
    setEdges((eds) =>
      rcAddEdge(
        {
          ...params,
          markerEnd:
            dataType === 'exec'
              ? {
                  type: MarkerType.Arrow,
                  width: 15,
                  height: 15,
                  color: getComputedStyle(document.body).getPropertyValue(
                    '--vp-exec-color'
                  ),
                }
              : undefined,

          data: {
            dataType,
          },
          style: {
            strokeWidth: 2,
            stroke: `${
              Array.isArray(dataType)
                ? DataTypes.any.shownInColor
                : DataTypes[dataType].shownInColor
            }`,
          },
        },
        eds
      )
    );
    updateHandleConnection(params.source, params.sourceHandle, true, true);
    updateHandleConnection(params.target, params.targetHandle, true, false);
  }, []);

  const deleteEdges = useCallback(
    (delEdgeSelector: (e: Edge) => boolean): void => {
      const toBeDel = getEdges().filter((e) => delEdgeSelector(e));
      if (toBeDel.length === 0) {
        return;
      }
      toBeDel.forEach((e) => {
        updateHandleConnection(e.source, e.sourceHandle, false, true);
        updateHandleConnection(e.target, e.targetHandle, false, false);
      });
      setEdges((eds) => eds.filter((e) => !delEdgeSelector(e)));
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

  const getHandle = useCallback(
    (nodeId: string, handleId: string): HandleData | undefined => {
      const node = getNodeById(nodeId);
      if (!node) return undefined;
      return node.data.inputs?.[handleId] || node.data.outputs?.[handleId];
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

  const deleteNodes = useCallback((nodesId: string[]): void => {
    const edgesId = getConnectedEdges(
      nodesId.map((id) => getNodeById(id)!),
      getEdges()
    ).map((e) => e.id);
    deleteEdges((e) => edgesId.includes(e.id));
    setNodes((nds) => nds.filter((n) => !nodesId.includes(n.id)));
    shouldUpdateDataTypeOfRerouteNode.current = true;
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

  const toJSONString = useCallback((): string => {
    if (getNodes().length === 0) return '';
    const graph = serializer.serialize({
      nodes: deepCopy(getNodes()),
      edges: deepCopy(getEdges()),
    });
    return JSON.stringify(graph);
  }, []);

  const fromSerializedGraph = useCallback(
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

  useEffect(() => {
    const createFunNodeWithRef: Record<string, string> = {};
    const createFunNodeWithoutRef: string[] = [];
    // the connection will affect the whole graph, so we need to update the whole graph
    let allNodes = getNodes();
    // find the return node for each createFunction node
    allNodes = allNodes.map((n) => {
      if (n.type === 'createFunction') {
        let found = false;
        let thisNode = n;
        const queue: Node[] = [thisNode];
        while (queue.length > 0 && !found) {
          thisNode = queue.shift()!;
          const edges = getConnectedEdges([thisNode], getEdges());
          const execEdges = edges.filter(
            (e) =>
              e.source === thisNode.id &&
              thisNode.data.outputs[e.sourceHandle!].dataType === 'exec'
          );
          if (execEdges.length === 0) {
            n = {
              ...n,
              data: {
                ...n.data,
                nodeRef: null,
              },
            };
            createFunNodeWithoutRef.push(n.id);
          } else {
            for (const execEdge of execEdges) {
              const nextNode = getNode(execEdge.target);
              if (!nextNode) {
                n = {
                  ...n,
                  data: {
                    ...n.data,
                    nodeRef: null,
                  },
                };
                createFunNodeWithoutRef.push(n.id);
              } else if (nextNode.type === 'return') {
                n = {
                  ...n,
                  data: {
                    ...n.data,
                    nodeRef: nextNode.id,
                  },
                };
                createFunNodeWithRef[n.id] = nextNode.id;
                found = true;
              } else {
                queue.push(nextNode);
              }
            }
          }
        }
      }
      return n;
    });

    const toBeUpdated = Object.keys(createFunNodeWithRef);
    allNodes = allNodes.map((n) => {
      // update the signature of the function call node
      if (toBeUpdated.includes(n.data.nodeRef)) {
        const returnNode = getNode(createFunNodeWithRef[n.data.nodeRef]);
        if (
          returnNode &&
          Object.keys(n.data.outputs).length !==
            Object.keys(returnNode.data.inputs).length
        ) {
          const inputsWithoutExec: Record<string, HandleData> = {};
          for (const [name, input] of Object.entries(returnNode.data.inputs)) {
            const handle = input as HandleData;
            if (handle.dataType !== 'exec') {
              handle.showTitle = true;
              inputsWithoutExec[name] = {
                ...handle,
                connection: n.data.outputs[name]?.connection ?? 0,
              };
            }
          }
          n.data.outputs = {
            functionCallExecOut: n.data.outputs.functionCallExecOut,
            ...inputsWithoutExec,
          };
        }
      }
      return n;
    });
    // at least keep the exec output for non-return-value function
    for (const node of Object.values(allNodes)) {
      if (createFunNodeWithoutRef.includes(node.data.nodeRef as string)) {
        node.data.outputs = {
          functionCallExecOut: node.data.outputs.functionCallExecOut,
        };
      }
    }
    setNodes(allNodes);
  }, [edges]);

  const updateDataTypeInImageOfFunctionCallNode = (nds: any[]): any[] => {
    const newNodes = nds.map((n) => {
      if (n.type === 'functionCall') {
        let index = -1;
        const nodeRef = getNode(n.data.nodeRef as string)!;
        for (const input of Object.values(n.data.inputs)) {
          index += 1;
          if ((input as any).dataType === 'exec') continue;
          // the default value is the default value of the input that connect to the output in the nodeRef node with same index
          const outputHandle = Object.keys(nodeRef.data.outputs)[index];
          const { nodes, connectedHandlesId } = getConnectedInfo(
            nodeRef.id,
            outputHandle
          );
          if (nodes.length === 0) {
            if ((input as any).dataType === 'image') {
              (input as any).defaultValue = null;
              (input as any).dataType = 'anyDataType';
            }
            continue;
          }
          const connectedHandle = nodes[0].data.inputs[connectedHandlesId[0]];
          if (connectedHandle.dataType === 'image') {
            (input as any).dataType = 'image';
            (input as any).defaultValue = connectedHandle.defaultValue;
          }
        }

        index = -1;
        for (const output of Object.values(n.data.outputs)) {
          index += 1;
          if ((output as any).dataType === 'exec') continue;
          // the default value is the default value of the output that connect to the input in the `return node` with same index
          const funcDef = getNode(n.data.nodeRef as string)!;
          const returnNode = getNode(funcDef.data.nodeRef as string)!;
          const inputHandle = Object.keys(returnNode.data.inputs)[index];
          const { nodes, connectedHandlesId } = getConnectedInfo(
            returnNode.id,
            inputHandle
          );
          if (nodes.length === 0) {
            if ((output as any).dataType === 'image') {
              (output as any).defaultValue = null;
              (output as any).dataType = 'anyDataType';
            }
            continue;
          }
          const connectedHandle = nodes[0].data.outputs[connectedHandlesId[0]];
          if (connectedHandle.dataType === 'image') {
            (output as any).dataType = 'image';
            (output as any).defaultValue = connectedHandle.defaultValue;
          }
        }

        n.data = {
          ...n.data,
          inputs: {
            ...n.data.inputs,
          },
        };
      } else if (n.type === 'createFunction') {
        // if any output connected to a value whose dataType is image, then change the dataType of the output to image and set the default value
        for (const [name, output] of Object.entries(n.data.outputs)) {
          if ((output as any).dataType === 'exec') continue;
          const { nodes, connectedHandlesId } = getConnectedInfo(n.id, name);
          if (nodes.length === 0) {
            if ((output as any).dataType === 'image') {
              (output as any).defaultValue = null;
              (output as any).dataType = 'anyDataType';
            }
            continue;
          }
          const connectedHandle = nodes[0].data.inputs[connectedHandlesId[0]];
          if (connectedHandle.dataType === 'image') {
            (output as any).dataType = 'image';
            (output as any).defaultValue = connectedHandle.defaultValue;
          }
        }
        n.data = {
          ...n.data,
          outputs: {
            ...n.data.outputs,
          },
        };
      } else if (n.type === 'return') {
        // if any output connected to a value whose dataType is image, then change the dataType of the output to image and set the default value

        for (const [name, input] of Object.entries(n.data.inputs)) {
          if ((input as any).dataType === 'exec') continue;
          const { nodes, connectedHandlesId } = getConnectedInfo(n.id, name);
          if (nodes.length === 0) {
            if ((input as any).dataType === 'image') {
              (input as any).defaultValue = null;
              (input as any).dataType = 'anyDataType';
            }
            continue;
          }
          const connectedHandle = nodes[0].data.outputs[connectedHandlesId[0]];
          if (connectedHandle.dataType === 'image') {
            (input as any).dataType = 'image';
            (input as any).defaultValue = connectedHandle.defaultValue;
          }
        }
        n.data = {
          ...n.data,
          outputs: {
            ...n.data.outputs,
          },
        };
      }
      return n;
    });
    return newNodes;
  };

  useEffect(() => {
    setNodes((nds) => {
      return updateDataTypeInImageOfFunctionCallNode(nds);
    });
  }, [edges]);

  const getConnectedInfo = (
    nodeId: string,
    handleId: string
  ): { nodes: Node[]; edges: Edge[]; connectedHandlesId: string[] } => {
    const connectedNodes: Node[] = [];
    const connectedEdges: Edge[] = [];
    const connectedHandlesId: string[] = [];
    for (const edge of getEdges()) {
      if (edge.source === nodeId && edge.sourceHandle === handleId) {
        const node = getNodeById(edge.target);
        connectedNodes.push(node!);
        connectedEdges.push(edge);
        connectedHandlesId.push(edge.targetHandle!);
      }
      if (edge.target === nodeId && edge.targetHandle === handleId) {
        const node = getNodeById(edge.source);
        connectedNodes.push(node!);
        connectedEdges.push(edge);
        connectedHandlesId.push(edge.sourceHandle!);
      }
    }
    return { nodes: connectedNodes, edges: connectedEdges, connectedHandlesId };
  };

  const findFunctionCallNodes = (
    startNode: Node,
    functionCallNodes: Node[],
    visitedNodeIds: string[] = []
  ): void => {
    if (visitedNodeIds.includes(startNode.id)) return;
    visitedNodeIds.push(startNode.id);
    Object.entries(startNode.data.outputs ?? {}).forEach(([name, output]) => {
      if ((output as any).dataType === 'exec') {
        getConnectedInfo(startNode.id, name).nodes.forEach((node) => {
          if (node.type === 'functionCall') {
            functionCallNodes.push(node);
          }
          findFunctionCallNodes(node, functionCallNodes, visitedNodeIds);
        });
      }
    });
  };

  return {
    initGraph,
    getFreeUniqueNodeIds,
    nodes,
    getNodes,
    getEdges,
    deleteNodes,
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
    addEdge,
    getHandle,
    getHandleConnectionCounts,
    anyConnectableNodeSelected,
    anyConnectionToSelectedNode,
    toJSONString,
    fromSerializedGraph,
    getConnectedInfo,
    findFunctionCallNodes,
  };
}
