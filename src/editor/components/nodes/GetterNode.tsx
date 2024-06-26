import React, { memo } from 'react';
import { type VariableNodeData } from '../../types';
import { SourceHandle } from '../handles';
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
        handleData={{
          ...data.outputs[outputId],
          tooltip: `return the value of ${data.outputs[outputId].title ?? ''} `,
        }}
        showWidget={false}
        showTitle={true}
      />
    );
  }
  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__body" style={{ padding: 0 }}>
        <div
          className="vp-node-handles-container"
          style={{ marginLeft: '15px' }}
        >
          {outputHandles}
        </div>
      </div>
    </div>
  );
}

export default memo(GetterNode);
