import React from 'react';
import { type HandleData } from '../../types';
import { Position } from 'reactflow';
import Handle from './Handle';

export default function SourceHandle({
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
      handleType="source"
      handlePosition={Position.Right}
      toHideWidgetWhenConnected={false}
      className="source-handle"
    />
  );
}
