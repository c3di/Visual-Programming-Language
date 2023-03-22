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
  if (data.tooltip === undefined)
    data.tooltip = `Get the value of ${data.value.title}`;
  return (
    <div title={data.tooltip}>
      <div className="setter-node__header">
        <strong>
          Make Literal&nbsp;
          {`${
            data.value.handle.dataType[0].toUpperCase() +
            data.value.handle.dataType.slice(1)
          }
          `}
        </strong>
      </div>
      <div className="setter-node__body">
        <TargetHandle
          id={`return_${data.value.title}`}
          nodeId={id}
          showWidget={true}
          showTitle={true}
          handleData={data.value.handle}
        />
        <SourceHandle
          id={data.value.title}
          nodeId={id}
          showWidget={false}
          showTitle={true}
          handleData={{
            ...data.value.handle.value,
            title: `Return ${data.value.handle.title}`,
          }}
        />
      </div>
    </div>
  );
}

export default memo(MakeLiteralNode);
