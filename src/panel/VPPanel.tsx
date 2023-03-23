/* eslint-disable react/prop-types */
import React from 'react';
import ReactFlow, {
  SelectionMode,
  ConnectionLineType,
  ReactFlowProvider,
} from 'reactflow';

import Setting from './VPPanelSetting';
import { useGraph, useScene, useKeyBinding } from './hooks';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import { type GraphData } from './types';
import 'reactflow/dist/style.css';
import './VPPanel.css';

const Scene = ({ graphData }: { graphData: GraphData }): JSX.Element => {
  const graphState = useGraph(graphData);
  const { nodes, onNodesChange, edges, onEdgesChange, onConnect } = graphState;
  const sceneState = useScene(graphState);
  const { onNodeDragStart, onNodeDragStop } = sceneState;
  useKeyBinding(sceneState);
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
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
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
      selectionKeyCode={null}
      selectionOnDrag
      panOnDrag={[2]} // 2 = right moues button
      deleteKeyCode="Delete"
      connectionLineType={
        (EdgeSetting.type as ConnectionLineType) || ConnectionLineType.Bezier
      }
      connectionRadius={EdgeSetting.portDetectionRadius}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={onNodeDragStop}
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
  graphData,
}: {
  graphData: GraphData;
}): JSX.Element {
  return (
    <ReactFlowProvider>
      <Scene graphData={graphData} />
    </ReactFlowProvider>
  );
}
