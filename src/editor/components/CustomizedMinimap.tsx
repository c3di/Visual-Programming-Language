import React, { useCallback, useState } from 'react';
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
  const [isMinimapHidden, setIsMinimapHidden] = useState(false);

  const handleMinimapToggle = useCallback(() => {
    setIsMinimapHidden((prevIsMinimapHidden) => !prevIsMinimapHidden);
  }, []);

  return (
    <div
      className="minimap-container"
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
      }}
    >
      <div className="button-group">
        <button
          className="button"
          onClick={handleMinimapToggle}
          style={{ position: 'relative', zIndex: 9999 }}
        >
          {isMinimapHidden ? 'Show' : 'Hide'}
        </button>
        <RfMinimap
          style={{ display: isMinimapHidden ? 'none' : 'block' }}
          zoomable={zoomable}
          pannable={pannable}
          ariaLabel="Mini Map"
        />
      </div>
    </div>
  );
}
