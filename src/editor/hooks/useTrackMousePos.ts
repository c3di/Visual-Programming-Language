import { useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { type MousePos } from '../types';

export interface IMouseTracker {
  mousePos: React.MutableRefObject<MousePos>;
  updateMousePos: (clientX: number, clientY: number) => void;
  domReference: React.RefObject<HTMLDivElement>;
}

export default function useTrackMousePos(
  domRef: React.RefObject<HTMLDivElement>
): IMouseTracker {
  const mousePos = useRef({ mouseX: 0, mouseY: 0 });
  const mapToLocalCoord = useReactFlow().project;
  const domReference = domRef;
  const updateMousePos = (clientX: number, clientY: number): void => {
    const bounding = domReference.current?.getBoundingClientRect();
    if (!bounding) return;
    const relativePos = {
      x: clientX - bounding.left,
      y: clientY - bounding.top,
    };
    const pos = mapToLocalCoord(relativePos);
    mousePos.current = {
      mouseX: pos.x,
      mouseY: pos.y,
    };
  };

  return { mousePos, updateMousePos, domReference };
}
