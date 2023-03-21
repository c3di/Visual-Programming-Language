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
        handleData={data.inputs[inputId]}
      />
    );
  }
  return (
    <div title={data.tooltip}>
      <div className="math-node__body">
        <strong>{data.title}</strong>
        {targetHandles}
        <SourceHandle
          id={data.output.title}
          nodeId={id}
          showWidget={false}
          handleData={data.output.handle}
        />
      </div>
    </div>
  );
}

export default memo(MathNode);
