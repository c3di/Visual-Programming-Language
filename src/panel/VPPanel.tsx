/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
} from 'reactflow';
import { WidgetFactoryProvider } from './Context';
import Setting from './VPPanelSetting';
import {
  useGraph,
  useScene,
  useKeyDown,
  useTrackMousePos,
  useContextMenu,
} from './hooks';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import { type SerializedGraph } from './types';
import 'reactflow/dist/style.css';
import './VPPanel.css';
import { NodeMenu, EdgeMenu, HandleMenu, SearchMenu } from './contextmenu';
import { nodeConfigRegistry } from '../Extension';

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
  const { onNodeDragStart, onNodeDragStop, isValidConnection } = sceneState;
  const { onKeyDown } = useKeyDown(sceneState);
  const contextMenu = useContextMenu();
  const {
    view: viewSetting,
    select: selectSetting,
    Edge: EdgeSetting,
    background: bgSetting,
    controlPanel: cpSetting,
    minimap: minimpSetting,
  } = Setting;
  return (
    <>
      <SearchMenu
        open={contextMenu.showSearchMenu}
        onClose={() => {
          contextMenu.setShowSearchMenu(false);
        }}
        anchorPosition={contextMenu.contextMenuPosiont}
        nodeConfigs={nodeConfigRegistry.getAllNodeConfigs()}
        addNode={sceneState.addNode}
        moreCommands={sceneState.extraCommands}
      />
      <NodeMenu
        open={contextMenu.showNodeMenu}
        onClose={() => {
          contextMenu.setShowNodeMenu(false);
        }}
        anchorPosition={contextMenu.contextMenuPosiont}
        onDelete={sceneState.deleteSelectedElements}
        onCut={sceneState.cutSelectedNodesToClipboard}
        onCopy={sceneState.copySelectedNodeToClipboard}
        onDuplicate={sceneState.duplicateSelectedNodes}
        onPaste={sceneState.pasteFromClipboard}
        onBreakNodeLinks={sceneState.deleteAllEdgesOfSelectedNodes}
      />
      <EdgeMenu
        open={contextMenu.showEdgeMenu}
        onClose={() => {
          contextMenu.setShowEdgeMenu(false);
        }}
        anchorPosition={contextMenu.contextMenuPosiont}
        onDelete={sceneState.deleteSelectedElements}
      />
      <HandleMenu
        open={contextMenu.showHandleMenu}
        onClose={() => {
          contextMenu.setShowHandleMenu(false);
        }}
        connection={contextMenu.clickedHandle.current?.connection}
        anchorPosition={contextMenu.contextMenuPosiont}
        onBreakLinks={() => {
          if (
            contextMenu.clickedHandle.current &&
            contextMenu.clickedNodeId.current
          )
            sceneState.deleteAllEdgesOfHandle(
              contextMenu.clickedNodeId.current,
              contextMenu.clickedHandle.current.id
            );
        }}
      />
      <ReactFlow
        onMouseMove={(e) => {
          updateMousePos(e.clientX, e.clientY);
        }}
        onKeyDown={onKeyDown}
        onPaneContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          sceneState.selectAll(false);
          contextMenu.setContextMenuPosition({
            left: e.clientX,
            top: e.clientY,
          });
          contextMenu.setShowSearchMenu(true);
        }}
        onNodeContextMenu={(e, node) => {
          e.preventDefault();
          if (!node.selected) sceneState.selectNode(node.id);
          contextMenu.setContextMenuPosition({
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
            contextMenu.clickedHandle.current = { id, connection };
            contextMenu.clickedNodeId.current = node.id;
            contextMenu.setShowHandleMenu(true);
          } else contextMenu.setShowNodeMenu(true);
        }}
        onEdgeContextMenu={(e, edge) => {
          e.preventDefault();
          sceneState.selectEdge(edge.id);
          contextMenu.setContextMenuPosition({
            left: e.clientX,
            top: e.clientY,
          });
          contextMenu.setShowEdgeMenu(true);
        }}
        ref={domRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onEdgeClick={(e, edge) => {
          if (e.ctrlKey) deleteEdge(edge.id);
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
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onMove={(e) => {
          if (e instanceof MouseEvent) updateMousePos(e.clientX, e.clientY);
        }}
        onNodeDrag={(e) => {
          updateMousePos(e.clientX, e.clientY);
        }}
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

export default function VPPanel({
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
