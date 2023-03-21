import React, { memo } from 'react';
import './GetterNode.css';
import { type VariableNodeData } from '../../types';
import SourceHandle from '../SourceHandle';

function GetterNode({
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
      <SourceHandle
        id={data.value.title}
        nodeId={id}
        showWidget={false}
        showTitle={true}
        handleData={data.value.handle}
      />
    </div>
  );
}

export default memo(GetterNode);
