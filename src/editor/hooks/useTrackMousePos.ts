import { useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { type MousePos } from '../types';
import { fromClientCoordToScene } from '../util';

export interface IMouseTracker {
  mousePos: React.MutableRefObject<MousePos>;
  updateMousePos: (clientX: number, clientY: number) => void;
}

export default function useTrackMousePos(
  domRef: React.RefObject<HTMLDivElement>
): IMouseTracker {
  const mousePos = useRef({ mouseX: 0, mouseY: 0 });
  const mapToLocalCoord = useReactFlow().project;
  const updateMousePos = (clientX: number, clientY: number): void => {
    const { x: mouseX, y: mouseY } = fromClientCoordToScene(
      { clientX, clientY },
      domRef,
      mapToLocalCoord
    );
    mousePos.current = {
      mouseX,
      mouseY,
    };
  };

  return { mousePos, updateMousePos };
}
