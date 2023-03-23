/* eslint-disable react/prop-types */
import React, { type Dispatch, type SetStateAction, useEffect } from 'react';
import ReactFlow, {
  type Edge,
  SelectionMode,
  useKeyPress,
  ConnectionLineType,
  ReactFlowProvider,
} from 'reactflow';

import Setting from './VPPanelSetting';
import { useGraph, useScene } from './hooks';
import componentType, { Background, ControlPanel, MiniMap } from './components';
import { type Node, type GraphData } from './types';
import 'reactflow/dist/style.css';
import './VPPanel.css';

function selectionAllKeyBinding(
  setNodes: Dispatch<SetStateAction<Array<Node<any>>>>,
  setEdges: Dispatch<SetStateAction<Array<Edge<any>>>>
): void {
  const selectAllKeyPressed = useKeyPress('Control+a');
  const cancelAllKeyPressed = useKeyPress('Escape');

  const selectAll = (sure: boolean): void => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: sure })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: sure })));
  };
  useEffect(() => {
    if (selectAllKeyPressed) selectAll(true);
  }, [selectAllKeyPressed]);
  useEffect(() => {
    if (!cancelAllKeyPressed) selectAll(false);
  }, [cancelAllKeyPressed]);
}

const Scene = ({ graphData }: { graphData: GraphData }): JSX.Element => {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
  } = useGraph(graphData);
  selectionAllKeyBinding(setNodes, setEdges);

  const { onNodeDragStart, onNodeDragStop } = useScene(nodes);
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
