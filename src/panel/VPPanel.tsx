/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
} from 'reactflow';
import { builder } from './Builder';
import { WidgetFactoryProvider } from './Context';

import Setting from './VPPanelSetting';
import { useGraph, useScene, useKeyDown, useTrackMousePos } from './hooks';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import { type SerializedGraph } from './types';
import 'reactflow/dist/style.css';
import './VPPanel.css';

const Scene = ({
  serializedGraph,
}: {
  serializedGraph: SerializedGraph | undefined;
}): JSX.Element => {
  const domRef = useRef<HTMLDivElement>(null);
  const graphState = useGraph(builder.build(serializedGraph));
  const { nodes, onNodesChange, edges, onEdgesChange, onConnect, deleteEdge } =
    graphState;
  const { mousePos, updateMousePos } = useTrackMousePos(domRef);
  const sceneState = useScene(graphState, mousePos);
  const { onNodeDragStart, onNodeDragStop, isValidConnection } = sceneState;
  const { onKeyDown } = useKeyDown(sceneState);
  const {
    view: viewSetting,
    select: selectSetting,
    Edge: EdgeSetting,
    background: bgSetting,
    controlPanel: cpSetting,
    minimap: minimpSetting,
  } = Setting;
  return (
    <ReactFlow
      onMouseMove={(e) => {
        updateMousePos(e.clientX, e.clientY);
      }}
      onKeyDown={onKeyDown}
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
  );
};

export default function VPPanel({
  serializedGraph,
}: {
  serializedGraph: SerializedGraph;
}): JSX.Element {
  return (
    <WidgetFactoryProvider>
      <ReactFlowProvider>
        <Scene serializedGraph={serializedGraph} />
      </ReactFlowProvider>
    </WidgetFactoryProvider>
  );
}
