import { useCallback, useEffect } from 'react';
import { type XYPosition, getRectOfNodes, useKeyPress } from 'reactflow';
import { type ISceneState } from './useScene';

export default function useKeyDown(sceneState?: ISceneState): {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
} {
  const sceneActions = sceneState?.sceneActions;
  const selectAllKeyPressed = useKeyPress('Control+a');
  useEffect(() => {
    if (selectAllKeyPressed) {
      sceneActions?.selectAll(true);
    }
  }, [selectAllKeyPressed]);

  const cancelAllKeyPressed = useKeyPress('Escape');
  useEffect(() => {
    if (!cancelAllKeyPressed) sceneActions?.selectAll(false);
  }, [cancelAllKeyPressed]);

  const copyKeyPressed = useKeyPress('Control+c');
  useEffect(() => {
    if (copyKeyPressed) {
      sceneActions?.copySelectedNodeToClipboard();
    }
  }, [copyKeyPressed]);

  const pasteKeyPressed = useKeyPress('Control+v');
  useEffect(() => {
    if (pasteKeyPressed) {
      sceneActions?.pasteFromClipboard();
    }
  }, [pasteKeyPressed]);

  const duplicateKeyPressed = useKeyPress('Control+d');
  useEffect(() => {
    if (duplicateKeyPressed) {
      sceneActions?.duplicateSelectedNodes();
    }
  }, [duplicateKeyPressed]);

  const cutKeyPressed = useKeyPress('Control+x');
  useEffect(() => {
    if (cutKeyPressed) {
      sceneActions?.cutSelectedNodesToClipboard();
    }
  }, [cutKeyPressed]);

  const deleteKeyPressed = useKeyPress('Delete');
  useEffect(() => {
    if (deleteKeyPressed) {
      sceneActions?.deleteSelectedElements();
    }
  }, [deleteKeyPressed]);

  const centerNodeKeyPressed = useKeyPress('f');
  useEffect(() => {
    if (centerNodeKeyPressed) {
      sceneActions?.centerSelectedNodes();
    }
  }, [centerNodeKeyPressed]);
  const createCommentKeyPressed = useKeyPress(['c', 'C']);
  useEffect(() => {
    if (createCommentKeyPressed) {
      const nds = sceneActions?.selectedNodes();
      let rect = null;
      if ((nds ?? []).length > 0) {
        rect = getRectOfNodes(nds!);
      }
      const padding = 30;
      sceneActions?.addNode(
        'comment',
        rect
          ? ({ x: rect.x - padding, y: rect.y - padding } satisfies XYPosition)
          : undefined,
        {
          width: (rect?.width ?? 200) + 2 * padding,
          height: (rect?.height ?? 150) + 2 * padding,
        }
      );
    }
  }, [createCommentKeyPressed]);

  const createStickyNodeKeyPressed = useKeyPress(['s', 'S']);
  useEffect(() => {
    if (createStickyNodeKeyPressed) {
      sceneActions?.addNode('stickyNote');
    }
  }, [createStickyNodeKeyPressed]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('handle-widget')) {
      onHandleKeyDown(e);
      e.stopPropagation();
    }
  }, []);

  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        (e.target as HTMLElement).blur();
      }
    },
    []
  );

  return { onKeyDown };
}
