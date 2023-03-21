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
  if (data.tooltip === undefined)
    data.tooltip = `Get the value of ${data.value.title}`;
  return (
    <div title={data.tooltip}>
      <div className="setter-node__header">
        <strong>Set</strong>
      </div>
      <div className="setter-node__body">
        <TargetHandle
          id={`return_${data.value.title}`}
          nodeId={id}
          handleData={data.value.handle}
        />
        <SourceHandle
          id={data.value.title}
          nodeId={id}
          showWidget={false}
          handleData={data.value.handle}
        />
      </div>
    </div>
  );
}

export default memo(SetterNode);
