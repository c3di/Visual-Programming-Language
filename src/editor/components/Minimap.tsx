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
          color: 'black',
          marginRight: '15px',
          zIndex: 9999,
          border: 'none',
          cursor: 'pointer',
          opacity: 0.7,
          '&:hover': {
            backgroundColor: '#EEEEEE',
            opacity: 1,
          },
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
        }}
        zoomable={zoomable}
        pannable={pannable}
        ariaLabel="Mini Map"
      />
    </div>
  );
}
