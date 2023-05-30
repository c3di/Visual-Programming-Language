import React, { memo } from 'react';
import { type ConnectableData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';

function RerouteNode({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const inputhandles = [];
  for (const inputId in data.inputs) {
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={false}
        showTitle={false}
        handleData={data.inputs[inputId]}
      />
    );
  }
  const outputHandles = [];
  for (const outputId in data.outputs) {
    outputHandles.push(
      <SourceHandle
        key={outputId}
        id={outputId}
        nodeId={id}
        handleData={data.outputs[outputId]}
        showWidget={false}
        showTitle={false}
      />
    );
  }
  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__body" style={{ padding: 0, gap: '0px' }}>
        <div className="vp-node-handles-container">{inputhandles}</div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(RerouteNode);
