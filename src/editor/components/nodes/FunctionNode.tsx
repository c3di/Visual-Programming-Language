import React, { memo } from 'react';
import TargetHandle from '../TargetHandle';
import SourceHandle from '../SourceHandle';
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
        handleData={data.outputs[outputId]}
        showWidget={false}
        showTitle={true}
      />
    );
  }
  return (
    <div title={data.tooltip}>
      <div className="node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="node__body">
        <div className="node__input-handles">{inputhandles}</div>
        <div className="node__output-handles">{outputHandles}</div>
        <div className="node__clear"></div>
      </div>
    </div>
  );
}

export default memo(FunctionNode);
