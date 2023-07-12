import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
  ConnectionMode,
  getRectOfNodes,
  type ReactFlowInstance,
} from 'reactflow';
import {
  useGraph,
  useScene,
  useKeyDown,
  useTrackMousePos,
  type ISceneActions,
} from './hooks';

import Setting from './VPPanelSetting';
import { WidgetFactoryProvider, SceneStateContext } from './Context';
import type { SerializedGraph, selectedElementsCounts } from './types';
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
  const reactflowDomRef = useRef<HTMLDivElement>(null);
  const mouseTracker = useTrackMousePos(reactflowDomRef);
  const sceneState = useScene(graphState, mouseTracker.mousePos);
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
  const { onKeyDown } = useKeyDown(sceneState ?? undefined);
  const gui = sceneState?.gui;
  const {
    view: viewSetting,
    select: selectSetting,
    Edge: EdgeSetting,
    background: bgSetting,
    controlPanel: cpSetting,
    minimap: minimpSetting,
  } = Setting;

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
      <div className="vp-editor">
        {gui.widget}
        <ReactFlow
          id={id}
          onInit={(instance) => {
            sceneInstance.current = instance;
            setInitialed(true);
          }}
          fitView={!initialed}
          onMouseMove={(e) => {
            mouseTracker?.updateMousePos(e.clientX, e.clientY);
          }}
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
            const x = mouseTracker?.mousePos.current.mouseX;
            const y = mouseTracker?.mousePos.current.mouseY;
            const position = {
              // hardcode the width(10) and height(5) of the reroute node
              x: x === undefined ? 0 : x - 10,
              y: y === undefined ? 0 : y - 5,
            };
            const node = sceneActions?.addNode('reroute', position);
            sceneActions?.deleteEdge(edge.id);
            if (!node) return;
            sceneActions?.addEdge(
              node.id,
              'input',
              edge.source,
              edge.sourceHandle!
            );
            sceneActions?.addEdge(
              edge.target,
              edge.targetHandle!,
              node.id,
              'output'
            );
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
          }}
          onKeyDown={onKeyDown}
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
                addNode: sceneActions?.addNode,
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
                  connection: gui.clickedHandle.current?.connection,
                  onBreakLinks: () => {
                    if (gui.clickedHandle.current && gui.clickedNodeId.current)
                      sceneActions?.deleteAllEdgesOfHandle(
                        gui.clickedNodeId.current,
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
          ref={reactflowDomRef}
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
            closeWidget(null, true);
          }}
          onConnectEnd={() => {
            gui.connectionStartNodeId.current = null;
            gui.closeWidget();
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
            if (e instanceof MouseEvent)
              mouseTracker?.updateMousePos(e.clientX, e.clientY);
            closeWidget(null, true);
          }}
          onSelectionStart={(e) => {
            closeWidget(null, true);
          }}
          onNodeDrag={(e) => {
            mouseTracker?.updateMousePos(e.clientX, e.clientY);
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
              position={cpSetting.position}
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
