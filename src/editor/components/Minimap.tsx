import React, { useCallback, useState } from 'react';
import { MiniMap as RfMinimap } from 'reactflow';
import { Map, MapOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import './Minimap.css';

interface IMiniMapProps {
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
}: IMiniMapProps): JSX.Element {
  const [hidden, setHidden] = useState<boolean>(false);

  const handleMinimapToggle = useCallback(() => {
    setHidden((hidden) => !hidden);
  }, []);

  return (
    <div className="minimap-container">
      <div className="button-wrapper">
        <Button
          onClick={handleMinimapToggle}
          disableRipple={true}
          sx={{
            padding: 0,
            minWidth: '10px',
            width: '14px',
            height: '14px',
            color: 'black',
          }}
          className={`minimap-toggle-button minimap-${
            hidden ? 'hidden' : 'show'
          }`}
        >
          {hidden ? <MapOutlined /> : <Map />}
        </Button>
      </div>

      <div className="minimap" style={{ position: 'relative' }}>
        <RfMinimap
          style={{ display: hidden ? 'none' : 'block' }}
          zoomable={zoomable}
          pannable={pannable}
          ariaLabel="Mini Map"
        />
      </div>
    </div>
  );
}
