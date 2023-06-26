import React from 'react';
import { Position } from 'reactflow';
import Handle from './Handle';
import { type HandleData } from '../../types';

export default function TargetHandle({
  id,
  nodeId,
  handleData,
  showWidget,
  showTitle,
  onValueChange,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showWidget: boolean;
  showTitle: boolean;
  onValueChange?: (newVa: any, oldVa?: any) => void;
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
      onValueChange={onValueChange}
    />
  );
}
