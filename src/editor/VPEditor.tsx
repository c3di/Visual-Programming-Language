import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
  ConnectionMode,
} from 'reactflow';
import { WidgetFactoryProvider } from './Context';
import Setting from './VPPanelSetting';
import {
  useGraph,
  useScene,
  useKeyDown,
  useTrackMousePos,
  useGui,
} from './hooks';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import { type SerializedGraph } from './types';
import 'reactflow/dist/style.css';
import './VPEditor.css';
import {
  NodeMenu,
  EdgeMenu,
  HandleMenu,
  SearchMenu,
  ConnectionTip,
} from './gui';
import { nodeConfigRegistry } from './extension';

const Scene = ({
  graph,
}: {
  graph: SerializedGraph | undefined;
}): JSX.Element => {
  const domRef = useRef<HTMLDivElement>(null);
  const graphState = useGraph(graph);
  const { nodes, onNodesChange, edges, onEdgesChange, onConnect, deleteEdge } =
    graphState;
  const { mousePos, updateMousePos } = useTrackMousePos(domRef);
  const sceneState = useScene(graphState, mousePos);
  const { onNodeDragStart, onNodeDragStop } = sceneState;
  const { onKeyDown } = useKeyDown(sceneState);
  const gui = useGui();
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
  // guide from https://reactflow.dev/docs/guides/remove-attribution/
  const proOptions = { hideAttribution: true };
  return (
    <>
      <ConnectionTip
        open={gui.showConnectionTip}
        onClose={gui.closeWidget}
        anchorPosition={gui.PosiontOnGui}
        connectionStatus={gui.connectionStatus}
      />
      <SearchMenu
        open={gui.showSearchMenu}
        onClose={gui.closeWidget}
        anchorPosition={gui.PosiontOnGui}
        nodeConfigs={nodeConfigRegistry.getAllNodeConfigs()}
        addNode={sceneState.addNode}
        moreCommands={sceneState.extraCommands}
      />
      <NodeMenu
        open={gui.showNodeMenu}
        onClose={gui.closeWidget}
        anchorPosition={gui.PosiontOnGui}
        onDelete={sceneState.deleteSelectedElements}
        onCut={sceneState.cutSelectedNodesToClipboard}
        onCopy={sceneState.copySelectedNodeToClipboard}
        onDuplicate={sceneState.duplicateSelectedNodes}
        anyConnectableNodeSelected={sceneState.anyConnectableNodeSelected}
        anyConnectionToSelectedNode={sceneState.anyConnectionToSelectedNode}
        onBreakNodeLinks={sceneState.deleteAllEdgesOfSelectedNodes}
      />
      <EdgeMenu
        open={gui.showEdgeMenu}
        onClose={gui.closeWidget}
        anchorPosition={gui.PosiontOnGui}
        onDelete={sceneState.deleteSelectedElements}
      />
      <HandleMenu
        open={gui.showHandleMenu}
        onClose={gui.closeWidget}
        connection={gui.clickedHandle.current?.connection}
        anchorPosition={gui.PosiontOnGui}
        onBreakLinks={() => {
          if (gui.clickedHandle.current && gui.clickedNodeId.current)
            sceneState.deleteAllEdgesOfHandle(
              gui.clickedNodeId.current,
              gui.clickedHandle.current.id
            );
        }}
      />
      <ReactFlow
        onMouseMove={(e) => {
          updateMousePos(e.clientX, e.clientY);
        }}
        onPaneClick={(e) => {
          closeWidget(e);
        }}
        onNodeClick={(e, node) => {
          closeWidget(e);
        }}
        onEdgeClick={(e, edge) => {
          if (e.ctrlKey && e.button === 0) deleteEdge(edge.id);
          closeWidget(e);
        }}
        onEdgeDoubleClick={(e, edge) => {
          closeWidget(e);
          sceneState.clearEdgeSelection();
          const position = {
            // hardcode the width(10) and height(5) of the reroute node
            x: mousePos.current.mouseX - 10,
            y: mousePos.current.mouseY - 5,
          };
          const node = sceneState.addNode('reroute', position);
          sceneState.deleteEdge(edge.id);
          sceneState.addEdge(node.id, 'input', edge.source, edge.sourceHandle!);
          sceneState.addEdge(
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
          e.stopPropagation();
          sceneState.selectAll(false);
          gui.setPosiontOnGui({
            left: e.clientX,
            top: e.clientY,
          });
          gui.openWidget('search');
        }}
        onNodeContextMenu={(e, node) => {
          e.preventDefault();
          if (!node.selected) sceneState.selectNode(node.id);
          gui.setPosiontOnGui({
            left: e.clientX,
            top: e.clientY,
          });
          const handle = e.target as HTMLElement;
          if (handle?.classList.contains('react-flow__handle')) {
            const id = handle.dataset.handleid;
            if (!id) return;
            sceneState.clearEdgeSelection();
            const connection = sceneState.getHandleConnectionCounts(
              node.id,
              id
            );
            if (connection === null) return;
            gui.clickedHandle.current = { id, connection };
            gui.clickedNodeId.current = node.id;
            gui.openWidget('handle');
          } else gui.openWidget('node');
        }}
        onEdgeContextMenu={(e, edge) => {
          e.preventDefault();
          sceneState.selectEdge(edge.id);
          gui.setPosiontOnGui({
            left: e.clientX,
            top: e.clientY,
          });
          gui.openWidget('edge');
        }}
        ref={domRef}
        nodes={nodes}
        edges={edges}
        connectionMode={ConnectionMode.Loose}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={(connection) => {
          const status = sceneState.isValidConnection(connection);
          const isFromSource = (): boolean => {
            return gui.connectionStartNodeId.current === connection.source;
          };
          const toNode = isFromSource() ? connection.target : connection.source;
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

          if (toDom) {
            const bbox = toDom.getBoundingClientRect();
            gui.setPosiontOnGui({
              left: bbox.left + 10,
              top: bbox.top + 10,
            });
          }
          gui.openWidget('connectionTip');
          gui.setconnectionStatus(status);
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
        fitView
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
          (EdgeSetting.type as ConnectionLineType) || ConnectionLineType.Bezier
        }
        connectionRadius={EdgeSetting.portDetectionRadius}
        onNodeDragStart={(evt, node) => {
          closeWidget(evt, true);
          onNodeDragStart(evt, node);
        }}
        onNodeDragStop={onNodeDragStop}
        onMove={(e) => {
          if (e instanceof MouseEvent) updateMousePos(e.clientX, e.clientY);
          closeWidget(null, true);
        }}
        onSelectionStart={(e) => {
          closeWidget(null, true);
        }}
        onNodeDrag={(e) => {
          updateMousePos(e.clientX, e.clientY);
        }}
        proOptions={proOptions}
      >
        <MiniMap
          width={minimpSetting.width}
          height={minimpSetting.height}
          zoomable={minimpSetting.zoomable}
          pannable={minimpSetting.pannable}
        />
        <ControlPanel
          className={cpSetting.className}
          position={cpSetting.position}
        />
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
    </>
  );
};

export default function VPEditor({
  graph,
}: {
  graph: SerializedGraph;
}): JSX.Element {
  return (
    <WidgetFactoryProvider>
      <ReactFlowProvider>
        <Scene graph={graph} />
      </ReactFlowProvider>
    </WidgetFactoryProvider>
  );
}
