import React from 'react';
import { MiniMap as RfMinimap } from 'reactflow';

interface MiniMapProps {
  height: number;
  width: number;
  zoomable: boolean;
  pannable: boolean;
}
export default function MiniMap({
  height = 120,
  width = 200,
  zoomable = true,
  pannable = true,
}: MiniMapProps): JSX.Element {
  return (
    <RfMinimap
      style={{
        height,
        width,
      }}
      zoomable={zoomable}
      pannable={pannable}
      ariaLabel="Mini Map"
    />
  );
}
