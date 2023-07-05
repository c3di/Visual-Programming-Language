import React, { memo } from 'react';
import { type VariableNodeData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';
import { registVariableRef } from '../../util';

function SetterNode({
  id,
  data,
}: {
  id: string;
  data: VariableNodeData;
}): JSX.Element {
  registVariableRef(data, id);
  const inputhandles = [];
  console.log(data);
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
      <div className="node__header" style={{ textAlign: 'center' }}>
        <strong>SET</strong>
      </div>
      <div className="node__body">
        <div
          className="vp-node-handles-container"
          style={{ minWidth: '120px' }}
        >
          {inputhandles}
        </div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(SetterNode);
