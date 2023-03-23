import { useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { type MousePos } from '../types';

export default function useTrackMousePos(
  domRef: React.RefObject<HTMLDivElement>
): {
  mousePos: React.MutableRefObject<MousePos>;
  updateMousePos: (clientX: number, clientY: number) => void;
} {
  const mousePos = useRef({ mouseX: 0, mouseY: 0 });
  const mapToLocalCoord = useReactFlow().project;
  const updateMousePos = (clientX: number, clientY: number): void => {
    const bounding = domRef.current?.getBoundingClientRect();
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
    console.log('mousemove12', mousePos.current);
  };

  return { mousePos, updateMousePos };
}
