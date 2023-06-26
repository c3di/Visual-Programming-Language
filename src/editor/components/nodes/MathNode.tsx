import React, { memo } from 'react';
import { type ConnectableData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';

function MathNode({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const inputHandles = [];
  for (const inputId in data.inputs) {
    inputHandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={true}
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
      <div className="node__body">
        <div className="vp-node-handles-container">{inputHandles}</div>
        <div
          className="vp-node-handles-container"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: '1.5em',
          }}
        >
          <strong>{data.title}</strong>
        </div>
        <div
          className="vp-node-handles-container"
          style={{ justifyContent: 'center' }}
        >
          {outputHandles}
        </div>
      </div>
    </div>
  );
}

export default memo(MathNode);
