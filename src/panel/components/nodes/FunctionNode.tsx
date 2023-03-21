import React, { memo } from 'react';
// import { useReactFlow, useStoreApi, Position } from 'reactflow';
import './FunctionNode.css';
import TargetHandle from '../TargetHandle';
import SourceHandle from '../SourceHandle';
import { type FunctionNodeData } from '../../types';

function FunctionNode({
  id,
  data,
}: {
  id: string;
  data: FunctionNodeData;
}): JSX.Element {
  const handles = [];
  for (const inputId in data.inputs) {
    handles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showTitle={true}
        handleData={data.inputs[inputId]}
      />
    );
  }
  for (const outputId in data.outputs) {
    handles.push(
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
      <div className="function-node__header">
        This is a <strong>function node</strong>
      </div>
      <div className="function-node__body">{handles}</div>
    </div>
  );
}

export default memo(FunctionNode);
