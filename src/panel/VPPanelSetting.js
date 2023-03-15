const PanelSetting = {
  view: {
    zoomSize: [0.5, 2.0],
    snapToGrid: true,
    snapGridSize: [25, 25],
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
  select: {
    selectedIfFullShapeCovered: true,
  },
  Edge: {
    portDetectionRadius: 10,
    type: 'step', // 'smoothstep', 'step', 'straight', 'bezier'
  },
};
export default PanelSetting;
