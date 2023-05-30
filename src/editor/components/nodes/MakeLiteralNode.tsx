import React, { memo } from 'react';
import { type VariableNodeData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';

function MakeLiteralNode({
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
  for (const outputId in data.outputs) {
    outputHandles.push(
      <SourceHandle
        key={outputId}
        id={outputId}
        nodeId={id}
        showWidget={false}
        showTitle={true}
        handleData={data.outputs[outputId]}
      />
    );
  }

  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__header" style={{ textAlign: 'center' }}>
        <strong>Make Literal&nbsp;{data.dataType}</strong>
      </div>
      <div className="node__body">
        <div className="vp-node-handles-container">{inputhandles}</div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(MakeLiteralNode);
