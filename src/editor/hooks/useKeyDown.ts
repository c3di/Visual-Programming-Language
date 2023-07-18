import { type XYPosition, getRectOfNodes } from 'reactflow';
import { type ISceneState } from './useScene';

export function onKeyDown(
  e: React.KeyboardEvent<HTMLDivElement>,
  sceneState?: ISceneState
): void {
  const sceneActions = sceneState?.sceneActions;
  if (e.code === 'Escape') {
    sceneActions?.selectAll(false);
    e.preventDefault();
    e.stopPropagation();
  } else if (e.code === 'KeyA' && e.ctrlKey) {
    sceneActions?.selectAll(true);
    e.preventDefault();
    e.stopPropagation();
  } else if (e.code === 'KeyC' && e.ctrlKey) {
    sceneActions?.copySelectedNodeToClipboard();
  } else if (e.code === 'KeyV' && e.ctrlKey) {
    sceneActions?.pasteFromClipboard();
  } else if (e.code === 'KeyD' && e.ctrlKey) {
    sceneActions?.duplicateSelectedNodes();
  } else if (e.code === 'KeyX' && e.ctrlKey) {
    sceneActions?.cutSelectedNodesToClipboard();
  } else if (e.code === 'Delete') {
    sceneActions?.deleteSelectedElements();
  } else if (e.code === 'KeyF') {
    sceneActions?.centerSelectedNodes();
  } else if (e.code === 'KeyC') {
    const nds = sceneActions?.selectedNodes();
    let rect = null;
    if ((nds ?? []).length > 0) {
      rect = getRectOfNodes(nds!);
    }
    const padding = 30;
    sceneActions?.selectAll(false);
    const node = sceneActions?.addNode(
      'comment',
      rect
        ? ({ x: rect.x - padding, y: rect.y - padding } satisfies XYPosition)
        : undefined,
      {
        width: (rect?.width ?? 200) + 2 * padding,
        height: (rect?.height ?? 150) + 2 * padding,
        defaultEditable: true,
      },
      rect
        ? undefined
        : {
            x: -20,
            y: -10,
          }
    );
    if (node) {
      sceneActions?.selectNode(node.id);
      e.preventDefault();
      e.stopPropagation();
    }
  } else if (e.code === 'KeyS') {
    sceneActions?.addNode(
      'stickyNote',
      undefined,
      { defaultEditable: true },
      {
        x: -20,
        y: -20,
      }
    );
    e.preventDefault();
    e.stopPropagation();
  }
}
