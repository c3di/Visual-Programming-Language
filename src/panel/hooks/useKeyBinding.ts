import { useEffect } from 'react';
import { useKeyPress } from 'reactflow';

export default function useKeyBinding(selectAll: any): void {
  const selectAllKeyPressed = useKeyPress('Control+a');
  const cancelAllKeyPressed = useKeyPress('Escape');

  useEffect(() => {
    if (selectAllKeyPressed) selectAll(true);
  }, [selectAllKeyPressed]);
  useEffect(() => {
    if (!cancelAllKeyPressed) selectAll(false);
  }, [cancelAllKeyPressed]);
}
