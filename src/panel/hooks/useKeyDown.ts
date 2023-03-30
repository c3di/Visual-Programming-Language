import { useCallback, useEffect } from 'react';
import { useKeyPress } from 'reactflow';
import { type SceneState } from './useScene';

export default function useKeyDown(sceneState: SceneState): {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
} {
  const selectAllKeyPressed = useKeyPress('Control+a');
  useEffect(() => {
    if (selectAllKeyPressed) {
      console.log('selectAllKeyPressed', selectAllKeyPressed);
      sceneState.selectAll(true);
    }
  }, [selectAllKeyPressed]);

  const cancelAllKeyPressed = useKeyPress('Escape');
  useEffect(() => {
    console.log('cancelAllKeyPressed', cancelAllKeyPressed);
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

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log('onKeyDown', e.key, e.ctrlKey, e.shiftKey, e.altKey);
    if (e.key === 'Enter' || e.key === 'Escape') {
      (e.target as HTMLElement).blur();
    }
  }, []);
  return { onKeyDown };
}
