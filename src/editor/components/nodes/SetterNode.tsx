import React, { memo } from 'react';
import { type VariableNodeData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';

function SetterNode({
  id,
  data,
}: {
  id: string;
  data: VariableNodeData;
}): JSX.Element {
  const inputhandles = [];
  for (const inputId in data.inputs) {
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={true}
        showTitle={true}
        handleData={data.inputs[inputId]}
      />
    );
  }
  const outputHandles = [];
  for (const id in data.outputs) {
    outputHandles.push(
      <SourceHandle
        key={id}
        id={id}
        nodeId={id}
        handleData={data.outputs[id]}
        showWidget={false}
        showTitle={false}
      />
    );
  }
  return (
    <div title={data.tooltip} className="vp-node-containter">
      <div className="node__header" style={{ textAlign: 'center' }}>
        <strong>SET</strong>
      </div>
      <div className="node__body">
        <div
          className="vp-node-handles-containter"
          style={{ minWidth: '120px' }}
        >
          {inputhandles}
        </div>
        <div className="vp-node-handles-containter">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(SetterNode);
