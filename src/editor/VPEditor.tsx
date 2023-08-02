import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
  ConnectionMode,
  getRectOfNodes,
  type ReactFlowInstance,
  type PanelPosition,
} from 'reactflow';
import {
  useGraph,
  useScene,
  onKeyDown,
  useTrackMousePos,
  type ISceneActions,
} from './hooks';

import Setting from './VPPanelSetting';
import { WidgetFactoryProvider, SceneStateContext } from './Context';
import type {
  SerializedGraph,
  selectedElementsCounts,
  OnConnectStartParams,
} from './types';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import 'reactflow/dist/style.css';
import './VPEditor.css';

export interface IVPEditorOption {
  controller?: {
    hidden?: boolean;
  };
}

const Scene = ({
  id,
  graph,
  onContentChange,
  activated,
  onSceneActionsInit,
  onSelectionChange,
  option,
}: {
  id: string;
  graph?: SerializedGraph | null;
  onContentChange?: (graph: string) => void;
  activated?: boolean;
  onSceneActionsInit?: (actions: ISceneActions) => void;
  onSelectionChange?: (counts: selectedElementsCounts) => void;
  option?: IVPEditorOption;
}): JSX.Element => {
  const [initialed, setInitialed] = useState<boolean>(false);
  const currentContent = useRef<string>('');
  const sceneInstance = useRef<ReactFlowInstance | undefined>(undefined);

  const graphState = useGraph(graph);
  const sceneDomRef = useRef<HTMLDivElement>(null);
  const mouseTracker = useTrackMousePos(sceneDomRef);
  const sceneState = useScene(
    graphState,
    mouseTracker.mousePos,
    sceneInstance,
    sceneDomRef
  );
  const sceneActions = sceneState?.sceneActions;
  useEffect(() => {
    onSceneActionsInit?.(sceneActions);
  }, []);
  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    fromJSON,
    toString,
  } = graphState ?? {};
  const gui = sceneState?.gui;
  const {
    view: viewSetting,
    select: selectSetting,
    Edge: EdgeSetting,
    background: bgSetting,
    controlPanel: cpSetting,
    minimap: minimpSetting,
  } = Setting;

  const [startHandle, setStartHandle] = useState<OnConnectStartParams>();

  const closeWidget = useCallback(
    (e: React.MouseEvent | undefined | null, force: boolean = false): void => {
      if (!e?.button || force) gui.closeWidget();
    },
    []
  );
  useEffect(() => {
    if (!activated) {
      closeWidget(null, true);
    }
  }, [activated]);

  useEffect(() => {
    // the graph may be changed before the scene is initialized
    if (!initialed) return;
    if (toString() !== (graph ? JSON.stringify(graph) : '')) {
      const { nodes } = fromJSON(graph);
      const rect = getRectOfNodes(nodes);
      sceneInstance.current?.fitBounds(rect);
    }
  }, [graph, initialed]);

  const triggerContentChange = useCallback(() => {
    if (!onContentChange) return;
    const content = toString();
    if (content !== currentContent.current) {
      currentContent.current = content;
      onContentChange(content);
    }
  }, []);

  useEffect(() => {
    // block the initial change
    if (!initialed) return;
    triggerContentChange();
  }, [nodes, edges]);

  // guide from https://reactflow.dev/docs/guides/remove-attribution/
  const proOptions = { hideAttribution: true };
  return (
    <SceneStateContext.Provider value={sceneState}>
      <div
        className="vp-editor"
        ref={sceneDomRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (
            e.target === sceneDomRef.current ||
            (e.target as HTMLElement).classList.contains('react-flow__node')
          )
            onKeyDown(e, sceneState ?? undefined, sceneDomRef);
        }}
        onMouseMoveCapture={(e) => {
          mouseTracker?.updateMousePos(e.clientX, e.clientY);
        }}
        style={{ outline: 'none' }}
      >
        {gui.widget}
        <ReactFlow
          id={id}
          onInit={(instance) => {
            sceneInstance.current = instance;
            setInitialed(true);
          }}
          fitView={!initialed}
          onSelectionChange={(elements) => {
            if (!sceneActions) return;
            const selectedCounts = sceneActions.getSelectedCounts();
            if (
              selectedCounts.nodesCount !== elements.nodes.length ||
              selectedCounts.edgesCount !== elements.edges.length
            ) {
              const newCounts = {
                nodesCount: elements.nodes.length,
                edgesCount: elements.edges.length,
              };
              sceneActions.setSelectedCounts(newCounts);
              onSelectionChange?.(newCounts);
            }
          }}
          onPaneClick={(e) => {
            closeWidget(e);
          }}
          onNodeClick={(e, node) => {
            closeWidget(e);
          }}
          onEdgeClick={(e, edge) => {
            if (e.ctrlKey && e.button === 0) sceneActions?.deleteEdge(edge.id);
            closeWidget(e);
          }}
          onEdgeDoubleClick={(e, edge) => {
            closeWidget(e);
            sceneActions?.clearEdgeSelection();
            const node = sceneActions?.addNode(
              'reroute',
              undefined,
              {
                width: 21,
                height: 19,
              },
              { x: -10, y: -5 }
            );
            if (!node) return;
            // temp solution wait for the node to be rendered
            window.requestAnimationFrame(() => {
              onConnect({
                source: edge.source,
                sourceHandle: edge.sourceHandle!,
                target: node.id,
                targetHandle: 'input',
              });
              window.requestAnimationFrame(() => {
                onConnect({
                  source: node.id,
                  sourceHandle: 'output',
                  target: edge.target,
                  targetHandle: edge.targetHandle!,
                });
              });
            });
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
          }}
          onPaneContextMenu={(e) => {
            e.preventDefault();
            sceneActions?.selectAll(false);
            gui.openWidget(
              'search',
              {
                left: e.clientX,
                top: e.clientY,
              },
              {
                getSourceCode: sceneActions?.sourceCode,
                addNodeWithSceneCoord: sceneActions?.addNodeWithSceneCoord,
                clear: sceneActions?.clear,
                autoLayout: sceneActions?.autoLayout,
                moreCommands: sceneState?.extraCommands,
              }
            );
          }}
          onNodeContextMenu={(e, node) => {
            e.preventDefault();
            if (!node.selected) sceneActions?.selectNode(node.id);
            const handle = e.target as HTMLElement;
            if (handle?.classList.contains('react-flow__handle')) {
              const id = handle.dataset.handleid;
              if (!id) return;
              sceneActions?.clearEdgeSelection();
              const connection = sceneActions?.getHandleConnectionCounts(
                node.id,
                id
              );
              gui.clickedHandle.current = { id, connection };
              gui.clickedNodeId.current = node.id;
              gui.openWidget(
                'handleMenu',
                {
                  left: e.clientX,
                  top: e.clientY,
                },
                {
                  deletable: graphState.getHandle(node.id, id)?.deletable,
                  connection: gui.clickedHandle.current?.connection,
                  onBreakLinks: () => {
                    if (gui.clickedHandle.current && gui.clickedNodeId.current)
                      sceneActions?.deleteAllEdgesOfHandle(
                        gui.clickedNodeId.current,
                        gui.clickedHandle.current.id
                      );
                  },
                  onDeleteHandle: () => {
                    if (gui.clickedHandle.current && gui.clickedNodeId.current)
                      sceneActions?.deleteHandle(
                        gui.clickedNodeId.current,
                        graphState.getNodeById(gui.clickedNodeId.current)?.data
                          .configType,
                        gui.clickedHandle.current.id
                      );
                  },
                }
              );
            } else
              gui.openWidget(
                'nodeMenu',
                {
                  left: e.clientX,
                  top: e.clientY,
                },
                {
                  onDelete: sceneActions?.deleteSelectedElements,
                  onCut: sceneActions?.cutSelectedNodesToClipboard,
                  onCopy: sceneActions?.copySelectedNodeToClipboard,
                  onDuplicate: sceneActions?.duplicateSelectedNodes,
                  anyConnectableNodeSelected:
                    sceneState?.anyConnectableNodeSelected ?? false,
                  anyConnectionToSelectedNode:
                    sceneState?.anyConnectionToSelectedNode ?? false,
                  onBreakNodeLinks: sceneActions?.deleteAllEdgesOfSelectedNodes,
                }
              );
          }}
          onEdgeContextMenu={(e, edge) => {
            e.preventDefault();
            sceneActions?.selectEdge(edge.id);
            gui.openWidget(
              'edgeMenu',
              {
                left: e.clientX,
                top: e.clientY,
              },
              { onDelete: sceneActions?.deleteSelectedElements }
            );
          }}
          nodes={nodes}
          edges={edges}
          connectionMode={ConnectionMode.Loose}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={(connection) => {
            const status = sceneActions?.isValidConnection(connection);
            if (!status) return false;
            const isFromSource = (): boolean => {
              return gui.connectionStartNodeId.current === connection.source;
            };
            const toNode = isFromSource()
              ? connection.target
              : connection.source;
            const toHandle = isFromSource()
              ? connection.targetHandle
              : connection.sourceHandle;

            const toDom =
              document.querySelector(
                `[data-id="${toNode ?? ''}-${toHandle ?? ''}-target"]`
              ) ??
              document.querySelector(
                `[data-id="${toNode ?? ''}-${toHandle ?? ''}-source"]`
              );

            let bbox: DOMRect | undefined;
            if (toDom) {
              bbox = toDom.getBoundingClientRect();
            }
            gui.openWidget(
              'connectionTip',
              {
                left: bbox?.left ?? 0 + 10,
                top: bbox?.top ?? 0 + 10,
              },
              { connectionStatus: status }
            );
            return status.action !== 'reject';
          }}
          onConnectStart={(evt, params) => {
            gui.connectionStartNodeId.current = params.nodeId;

            const getHandleDataType = (
              nodeId: string | null,
              handleId: string | null,
              handleType: string | null
            ): string | null => {
              if (nodeId === null) return null;
              const nodeInfo = graphState.getNodeById(nodeId);
              if (!nodeInfo || handleId === null) return null;
              if (handleType === 'source') {
                return nodeInfo.data.outputs[handleId].dataType;
              } else if (handleType === 'target') {
                return nodeInfo.data.inputs[handleId].dataType;
              } else {
                return null;
              }
            };
            const startDataType = getHandleDataType(
              params.nodeId,
              params.handleId,
              params.handleType
            );
            setStartHandle({
              nodeId: params.nodeId,
              handleId: params.handleId,
              handleType: params.handleType,
              handleDataType: startDataType,
            });
            closeWidget(null, true);
          }}
          onConnectEnd={(e) => {
            const targetIsPane = (
              event?.target as HTMLElement
            )?.classList.contains('react-flow__pane');
            if (targetIsPane) {
              e.preventDefault();
              sceneActions?.selectAll(false);
              const { clientX, clientY } = event as MouseEvent;
              const toFilterFlag = true;
              gui.openWidget(
                'search',
                {
                  left: clientX,
                  top: clientY,
                },
                {
                  addNodeWithSceneCoord: sceneActions?.addNodeWithSceneCoord,
                  clear: sceneActions?.clear,
                  autoLayout: sceneActions?.autoLayout,
                  moreCommands: sceneState?.extraCommands,
                  toFilter: toFilterFlag,
                  startHandleInfo: startHandle,
                  addEdge: sceneActions?.addEdge,
                }
              );
            }
            gui.connectionStartNodeId.current = null;
          }}
          attributionPosition="top-right"
          nodeTypes={componentType.nodeTypes}
          edgesFocusable={false}
          zoomOnDoubleClick={false}
          minZoom={viewSetting.zoomSize[0]}
          maxZoom={viewSetting.zoomSize[1]}
          snapToGrid={viewSetting.snapToGrid}
          snapGrid={viewSetting.snapGridSize as [number, number]}
          onlyRenderVisibleElements={viewSetting.onlyRenderVisibleElements}
          selectionMode={
            selectSetting.selectedIfFullShapeCovered
              ? SelectionMode.Full
              : SelectionMode.Partial
          }
          multiSelectionKeyCode="Shift"
          deleteKeyCode="null"
          selectionKeyCode={null}
          selectionOnDrag
          panOnDrag={[2]} // 2 = right moues button
          connectionLineType={
            (EdgeSetting.type as ConnectionLineType) ||
            ConnectionLineType.Bezier
          }
          connectionRadius={EdgeSetting.portDetectionRadius}
          onNodeDragStart={(evt, node) => {
            closeWidget(evt, true);
            sceneActions?.onNodeDragStart(evt, node);
          }}
          onNodeDragStop={sceneActions?.onNodeDragStop}
          onMove={(e) => {
            closeWidget(null, true);
          }}
          onSelectionStart={(e) => {
            closeWidget(null, true);
          }}
          proOptions={proOptions}
        >
          <MiniMap
            width={minimpSetting.width}
            height={minimpSetting.height}
            zoomable={minimpSetting.zoomable}
            pannable={minimpSetting.pannable}
          />
          {!option?.controller?.hidden && (
            <ControlPanel
              className={cpSetting.className}
              position={cpSetting.position as PanelPosition}
            />
          )}
          <Background
            type={bgSetting.type}
            gap={bgSetting.gap}
            dotSize={bgSetting.dotSize}
            crossSize={bgSetting.crossSize}
            lineWidth={bgSetting.lineWidth}
            color={bgSetting.color}
            className={bgSetting.className}
          />
        </ReactFlow>
      </div>
    </SceneStateContext.Provider>
  );
};

export default function VPEditor({
  id,
  content = null,
  onContentChange,
  activated,
  onSceneActionsInit,
  onSelectionChange,
  option,
}: {
  id: string;
  content?: SerializedGraph | null;
  onContentChange?: (content: string) => void;
  activated?: boolean;
  onSceneActionsInit?: (actions: ISceneActions) => void;
  onSelectionChange?: (counts: selectedElementsCounts) => void;
  option?: IVPEditorOption;
}): JSX.Element {
  return (
    <WidgetFactoryProvider>
      <ReactFlowProvider>
        <Scene
          id={id}
          graph={content}
          onContentChange={onContentChange}
          activated={activated}
          onSceneActionsInit={onSceneActionsInit}
          onSelectionChange={onSelectionChange}
          option={option}
        />
      </ReactFlowProvider>
    </WidgetFactoryProvider>
  );
}
