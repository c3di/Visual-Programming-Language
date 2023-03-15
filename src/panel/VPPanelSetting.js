const PanelSetting = {
  view: {
    zoomSize: [0.5, 2.0],
    snapToGrid: true,
    snapGridSize: [25, 25],
    onlyRenderVisibleElements: true,
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
