/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from 'reactflow';

import Setting from './VPPanelSetting';

import componentType from './components';

import 'reactflow/dist/style.css';
import './VPPanel.css';

const minimapStyle = {
  height: 120,
};

const OverviewFlow = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Array<Node<any, string>>;
  initialEdges: Array<Edge<any>>;
}): JSX.Element => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);
  const { view: viewSetting } = Setting;
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
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default OverviewFlow;
