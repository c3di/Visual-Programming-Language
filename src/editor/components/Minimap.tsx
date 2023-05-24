import React, { useCallback, useState } from 'react';
import { MiniMap as RfMinimap } from 'reactflow';
import MapIcon from '@mui/icons-material/Map';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import './Minimap.css';

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
  const [isMinimapHidden, setIsMinimapHidden] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleMinimapToggle = useCallback(() => {
    setIsMinimapHidden((prevIsMinimapHidden) => !prevIsMinimapHidden);
    setIsButtonClicked(!isButtonClicked);
  }, [isMinimapHidden, isButtonClicked]);

  return (
    <div className="minimap-container">
      <div className="button-wrapper">
        <button
          className={`button ${isButtonClicked ? 'button-clicked' : ''}`}
          onClick={handleMinimapToggle}
        >
          {isMinimapHidden ? <MapOutlinedIcon /> : <MapIcon />}
        </button>
      </div>
      <div className="minimap" style={{ position: 'relative' }}>
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
