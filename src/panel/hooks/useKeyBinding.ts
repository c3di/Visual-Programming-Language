import { useEffect } from 'react';
import { useKeyPress } from 'reactflow';
import { type SceneState } from './useScene';

export default function useKeyBinding(sceneState: SceneState): void {
  const { selectAll } = sceneState.graphState;
  const selectAllKeyPressed = useKeyPress('Control+a');
  const cancelAllKeyPressed = useKeyPress('Escape');

  useEffect(() => {
    if (selectAllKeyPressed) selectAll(true);
  }, [selectAllKeyPressed]);
  useEffect(() => {
    if (!cancelAllKeyPressed) selectAll(false);
  }, [cancelAllKeyPressed]);
}
