import React from 'react';
import {
  Controls as RfControls,
  type PanelPosition as ControlPanelPosition,
} from 'reactflow';

interface ControlPanelProps {
  className: string | undefined;
  position: string;
}

export default function ControlPanel({
  className = undefined,
  position = 'bottom-left',
}: ControlPanelProps): JSX.Element {
  return (
    <RfControls
      showInteractive={false}
      className={className}
      position={position as ControlPanelPosition | 'bottom-left'}
    />
  );
}
