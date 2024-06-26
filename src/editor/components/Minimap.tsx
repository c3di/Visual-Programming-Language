import React, { useCallback, useState } from 'react';
import { MiniMap as RfMinimap } from 'reactflow';
import { Map, MapOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import './Minimap.css';

interface IMiniMapProps {
  zoomable: boolean;
  pannable: boolean;
  collapsed?: boolean;
}

export default function MiniMap({
  zoomable = true,
  pannable = true,
  collapsed = false,
}: IMiniMapProps): JSX.Element {
  const [hidden, setHidden] = useState<boolean>(collapsed);

  const handleMinimapToggle = useCallback(() => {
    setHidden((hidden) => !hidden);
  }, []);

  return (
    <div
      className="minimap-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: '25px',
        right: '5px',
      }}
    >
      <Button
        onClick={handleMinimapToggle}
        disableRipple={true}
        title={'Toggle Mini Map'}
        sx={{
          padding: 0,
          minWidth: '10px',
          width: '23px',
          height: '23px',
          color: 'inherit',
          marginRight: '15px',
          zIndex: 9999,
          border: 'none',
          cursor: 'pointer',
          opacity: 0.7,
        }}
        className={`minimap-toggle-button minimap-${
          hidden ? 'hidden' : 'show'
        }`}
      >
        {hidden ? (
          <MapOutlined sx={{ width: '100%', height: '100%' }} />
        ) : (
          <Map sx={{ width: '100%', height: '100%' }} />
        )}
      </Button>

      <RfMinimap
        style={{
          display: hidden ? 'none' : 'block',
          position: 'relative',
          marginTop: '0',
          marginBottom: '0',
        }}
        zoomable={zoomable}
        pannable={pannable}
        ariaLabel="Mini Map"
      />
    </div>
  );
}
