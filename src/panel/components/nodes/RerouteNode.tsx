import React, { memo } from 'react';
import './RerouteNode.css';
import { type Reroute } from '../../types';
import SourceHandle from '../SourceHandle';
import TargetHandle from '../TargetHandle';

function RerouteNode({ id, data }: { id: string; data: Reroute }): JSX.Element {
  return (
    <div title={data.tooltip}>
      <TargetHandle
        id={'target'}
        nodeId={id}
        showWidget={false}
        showTitle={false}
        handleData={data.input}
      />
      <SourceHandle
        id={'source'}
        nodeId={id}
        showWidget={false}
        showTitle={false}
        handleData={data.output}
      />
    </div>
  );
}

export default memo(RerouteNode);
