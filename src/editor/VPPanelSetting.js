const PanelSetting = {
  view: {
    zoomSize: [0.1, 2.0],
    snapToGrid: false,
    snapGridSize: [16, 16],
    onlyRenderVisibleElements: true,
  },
  background: {
    type: 'dots', // 'dots', 'lines', 'cross', 'none'
    gap: 16,
    dotSize: 1,
    crossSize: 2,
    lineWidth: 1,
    color: '#000000',
    className: undefined,
  },
  controlPanel: {
    className: undefined,
    position: 'bottom-left', // 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'
  },
  minimap: {
    height: 120,
    width: 200,
    zoomable: true,
    pannable: true,
  },
  select: {
    selectedIfFullShapeCovered: true,
  },
  Edge: {
    portDetectionRadius: 10, // keep this value less than the distance between two ports
    type: 'default', // 'default(bezier)', 'smoothstep', 'step', 'straight', 'bezier'
  },
};
export default PanelSetting;
