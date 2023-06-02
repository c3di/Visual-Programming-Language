import React, { memo } from 'react';
import './GetterNode.css';
import { type VariableNodeData } from '../../types';
import SourceHandle from '../SourceHandle';
import { registVariableRef } from '../../util';

function GetterNode({
  id,
  data,
}: {
  id: string;
  data: VariableNodeData;
}): JSX.Element {
  registVariableRef(data, id);
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
  return <div title={data.tooltip}>{outputHandles}</div>;
}

export default memo(GetterNode);
