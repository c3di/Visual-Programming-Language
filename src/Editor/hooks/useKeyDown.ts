import { useCallback, useEffect } from 'react';
import { useKeyPress } from 'reactflow';
import { type SceneState } from './useScene';

export default function useKeyDown(sceneState: SceneState): {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
} {
  const selectAllKeyPressed = useKeyPress('Control+a');
  useEffect(() => {
    if (selectAllKeyPressed) {
      sceneState.selectAll(true);
    }
  }, [selectAllKeyPressed]);

  const cancelAllKeyPressed = useKeyPress('Escape');
  useEffect(() => {
    if (!cancelAllKeyPressed) sceneState.selectAll(false);
  }, [cancelAllKeyPressed]);

  const copyKeyPressed = useKeyPress('Control+c');
  useEffect(() => {
    if (copyKeyPressed) {
      sceneState.copySelectedNodeToClipboard();
    }
  }, [copyKeyPressed]);

  const pasteKeyPressed = useKeyPress('Control+v');
  useEffect(() => {
    if (pasteKeyPressed) {
      sceneState.pasteFromClipboard();
    }
  }, [pasteKeyPressed]);

  const duplicateKeyPressed = useKeyPress('Control+d');
  useEffect(() => {
    if (duplicateKeyPressed) {
      sceneState.duplicateSelectedNodes();
    }
  }, [duplicateKeyPressed]);

  const cutKeyPressed = useKeyPress('Control+x');
  useEffect(() => {
    if (cutKeyPressed) {
      sceneState.cutSelectedNodesToClipboard();
    }
  }, [cutKeyPressed]);

  const deleteKeyPressed = useKeyPress('Delete');
  useEffect(() => {
    if (deleteKeyPressed) {
      sceneState.deleteSelectedElements();
    }
  }, [deleteKeyPressed]);

  const centerNodeKeyPressed = useKeyPress('f');
  useEffect(() => {
    if (centerNodeKeyPressed) {
      sceneState.centerSelectedNodes();
    }
  }, [centerNodeKeyPressed]);

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
