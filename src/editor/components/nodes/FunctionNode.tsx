import React, { memo } from 'react';
import { TargetHandle, SourceHandle } from '../handles';
import { type ConnectableData } from '../../types';

function FunctionNode({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const inputhandles = [];
  for (const inputId in data.inputs) {
    const handle = data.inputs[inputId];
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={
          (!!handle.showWidget || handle.showWidget === undefined) &&
          handle.dataType !== 'exec'
        }
        showTitle={
          (!!handle.showTitle || handle.showTitle === undefined) &&
          handle.dataType !== 'exec'
        }
        handleData={handle}
      />
    );
  }
  const outputHandles = [];
  for (const outputId in data.outputs) {
    const handle = data.outputs[outputId];
    outputHandles.push(
      <SourceHandle
        key={outputId}
        id={outputId}
        nodeId={id}
        handleData={data.outputs[outputId]}
        showWidget={!!handle.showWidget && handle.dataType !== 'exec'}
        showTitle={
          (!!handle.showTitle || handle.showTitle === undefined) &&
          handle.dataType !== 'exec'
        }
      />
    );
  }
  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="node__body">
        <div className="vp-node-handles-container">{inputhandles}</div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(FunctionNode);
