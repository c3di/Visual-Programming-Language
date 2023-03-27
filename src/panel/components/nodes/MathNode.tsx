import React, { memo } from 'react';
import './MathNode.css';
import { type MathNodeData } from '../../types';
import SourceHandle from '../SourceHandle';
import TargetHandle from '../TargetHandle';

function MathNode({
  id,
  data,
}: {
  id: string;
  data: MathNodeData;
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
    <div title={data.tooltip} className="math-node__body">
      <div className="math-node__input-handles">{inputHandles}</div>
      <div className="math-node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="math-node__output-handles">{outputHandles}</div>
    </div>
  );
}

export default memo(MathNode);
