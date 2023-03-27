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
  const targetHandles = [];
  for (const inputId in data.inputs) {
    targetHandles.push(
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
  return (
    <div title={data.tooltip} className="math-node__body">
      <div className="math-node__input-handles">{targetHandles}</div>
      <div className="math-node__header">
        <strong>{data.title}</strong>
      </div>
      <div className="math-node__output-handles">
        <SourceHandle
          id={data.output.title}
          nodeId={id}
          showWidget={false}
          showTitle={false}
          handleData={data.output.handle}
        />
      </div>
    </div>
  );
}

export default memo(MathNode);
