import React from 'react';
import { Position } from 'reactflow';
import { type HandleData } from '../../types';
import Handle from './Handle';

export default function TargetHandle({
  id,
  nodeId,
  handleData,
  showWidget,
  showTitle,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showWidget: boolean;
  showTitle: boolean;
}): JSX.Element {
  return (
    <Handle
      id={id}
      nodeId={nodeId}
      handleData={handleData}
      showWidget={showWidget}
      showTitle={showTitle}
      handleType="target"
      handlePosition={Position.Left}
      toHideWidgetWhenConnected={true}
      className="target-handle"
    />
  );
}