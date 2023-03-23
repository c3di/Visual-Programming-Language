/* eslint-disable react/prop-types */
import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  SelectionMode,
  useKeyPress,
  ConnectionLineType,
  ReactFlowProvider,
} from 'reactflow';

import Setting from './VPPanelSetting';

import componentType, { Background, ControlPanel, MiniMap } from './components';
import { Graph, type Node, isCommentNode, type GraphData } from './types';
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
  const graph = Graph(graphData);
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.data.edges);
  selectionAllKeyBinding(setNodes, setEdges);
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);
  const nodesRefInCommentNode = React.useRef({});

  const onNodeDragStart = (evt: any, node: Node): void => {
    nodes.forEach((node) => {
      saveNodesInSelectedCommentNode(node);
    });
  };

  const saveNodesInSelectedCommentNode = (node: Node): void => {
    if (!node?.selected || !isCommentNode(node.data)) return;
    const nodesInComment = nodes.filter(
      (n) =>
        !n.selected &&
        n.position.x > node.position.x &&
        n.position.x + (n.width ?? 0) < node.position.x + (node.width ?? 0) &&
        n.position.y > node.position.y &&
        n.position.y + (n.height ?? 0) < node.position.y + (node.height ?? 0) &&
        n.id !== node.id
    );
    if (!nodesInComment) return;
    nodesRefInCommentNode.current = {
      ...nodesRefInCommentNode.current,
      [node.id]: nodesInComment,
    };
    // map to local coordinate
    nodesInComment.forEach((part, index, nodes) => {
      const n = nodes[index];
      n.position = {
        x: n.position.x - node.position.x,
        y: n.position.y - node.position.y,
      };
      n.parentNode = node.id;
    });
  };

  const clearNodesInSelectedCommentNode = (node: Node): void => {
    if (!node || !isCommentNode(node.data)) return;
    if (!nodesRefInCommentNode.current) return;
    const nodesInComment = (nodesRefInCommentNode.current as any)[`${node.id}`];
    if (!nodesInComment) return;
    nodesInComment.forEach((part: any, index: number, nodes: Node[]) => {
      const n = nodes[index];
      n.position = {
        x: n.position.x + node.position.x,
        y: n.position.y + node.position.y,
      };
      n.parentNode = undefined;
    });
    nodesRefInCommentNode.current = {};
  };

  const onNodeDragStop = (evt: any, node: Node): void => {
    nodes.forEach((node) => {
      clearNodesInSelectedCommentNode(node);
    });
  };

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
