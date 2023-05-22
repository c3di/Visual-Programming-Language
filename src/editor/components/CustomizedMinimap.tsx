import React from 'react';
import { MiniMap as RfMinimap } from 'reactflow';

interface MiniMapProps {
  height: number;
  width: number;
  zoomable: boolean;
  pannable: boolean;
}
export default function CustomizedMiniMap({
  height = 120,
  width = 200,
  zoomable = true,
  pannable = true,
}: MiniMapProps): JSX.Element {
  return (
    <div className="minimap-container">
      <div className="button-group">
        <button
          className="button"
          onClick={() => {
            console.log('zoom in');
          }}
        >
          Zoom In
        </button>
        <button
          className="button"
          onClick={() => {
            console.log('zoom out');
          }}
        >
          Zoom Out
        </button>
        <button
          className="button"
          onClick={() => {
            console.log('pan up');
          }}
        >
          Pan Up
        </button>
        <button
          className="button"
          onClick={() => {
            console.log('pan down');
          }}
        >
          Pan Down
        </button>
        <button
          className="button"
          onClick={() => {
            console.log('pan left');
          }}
        >
          Pan Left
        </button>
        <button
          className="button"
          onClick={() => {
            console.log('pan right');
          }}
        >
          Pan Right
        </button>
      </div>
      <div className="minimap">
        <RfMinimap
          style={{
            height,
            width,
          }}
          zoomable={zoomable}
          pannable={pannable}
          ariaLabel="Mini Map"
        />
      </div>
    </div>
  );
}
