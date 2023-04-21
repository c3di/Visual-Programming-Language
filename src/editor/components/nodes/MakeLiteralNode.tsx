import React, { memo } from 'react';
import './MakeLiteralNode.css';
import { type VariableNodeData } from '../../types';
import SourceHandle from '../SourceHandle';
import TargetHandle from '../TargetHandle';

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
    <div title={data.tooltip}>
      <div className="setter-node__header">
        <strong>Make Literal&nbsp;{data.dataType}</strong>
      </div>
      <div className="node__body">
        {inputhandles}
        {outputHandles}
        <div className="node__clear"></div>
      </div>
    </div>
  );
}

export default memo(MakeLiteralNode);