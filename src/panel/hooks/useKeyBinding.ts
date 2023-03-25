import { useEffect } from 'react';
import { useKeyPress } from 'reactflow';
import { type SceneState } from './useScene';

export default function useKeyBinding(sceneState: SceneState): void {
  const selectAllKeyPressed = useKeyPress('Control+a');
  const cancelAllKeyPressed = useKeyPress('Escape');
  const copyKeyPressed = useKeyPress('Control+c');
  const pasteKeyPressed = useKeyPress('Control+v');
  const deleteKeyPressed = useKeyPress('Delete');
  const duplicateKeyPressed = useKeyPress('Control+d');
  const cutKeyPressed = useKeyPress('Control+x');

  useEffect(() => {
    if (selectAllKeyPressed) sceneState.selectAll(true);
  }, [selectAllKeyPressed]);
  useEffect(() => {
    if (!cancelAllKeyPressed) sceneState.selectAll(false);
  }, [cancelAllKeyPressed]);
  useEffect(() => {
    if (copyKeyPressed) {
      sceneState.copySelectedNodeToClipboard();
    }
  }, [copyKeyPressed]);
  useEffect(() => {
    if (pasteKeyPressed) {
      sceneState.pasteFromClipboard();
    }
  }, [pasteKeyPressed]);
  useEffect(() => {
    if (deleteKeyPressed) {
      sceneState.deleteSelectedElements();
    }
  }, [deleteKeyPressed]);
  useEffect(() => {
    if (duplicateKeyPressed) {
      sceneState.duplicateSelectedNodes();
    }
  }, [duplicateKeyPressed]);
  useEffect(() => {
    if (cutKeyPressed) {
      sceneState.cutSelectedNodesToClipboard();
    }
  }, [cutKeyPressed]);
}
