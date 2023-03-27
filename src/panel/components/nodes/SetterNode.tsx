import React, { memo } from 'react';
import './SetterNode.css';
import { type VariableNodeData } from '../../types';
import SourceHandle from '../SourceHandle';
import TargetHandle from '../TargetHandle';

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
  for (const id in data.inputs) {
    outputHandles.push(
      <SourceHandle
        key={id}
        id={id}
        nodeId={id}
        handleData={data.inputs[id]}
        showWidget={false}
        showTitle={false}
      />
    );
  }
  return (
    <div title={data.tooltip}>
      <div className="setter-node__header">
        <strong>Set</strong>
      </div>
      <div className="node__body">
        {inputhandles}
        {outputHandles}
        <div className="node__clear"></div>
      </div>
    </div>
  );
}

export default memo(SetterNode);
