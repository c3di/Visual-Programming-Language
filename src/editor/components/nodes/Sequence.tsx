import React, { memo, useCallback, useRef } from 'react';
import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { SourceHandle, TargetHandle } from '../handles';
import { type ConnectableData } from '../../types';
import { useSceneState } from '../../Context';
function Sequence({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const inputhandles = [];
  for (const inputId in data.inputs) {
    const handle = data.inputs[inputId];
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={false}
        showTitle={false}
        handleData={handle}
      />
    );
  }

  const outputHandles = [];
  for (const outputId in data.outputs) {
    const handle = data.outputs[outputId];
    outputHandles.push(
      <SourceHandle
        key={outputId}
        id={outputId}
        nodeId={id}
        handleData={{ ...handle, tooltip: 'exec out' }}
        showWidget={!!handle.showWidget}
        showTitle={true}
      />
    );
  }

  const handleCount = useRef<number>(0);
  const { setNodes } = useSceneState()?.sceneActions ?? {};
  const addNewHandle = useCallback(() => {
    const newId = `execOut-${handleCount.current++}`;
    const value = {
      dataType: 'exec',
      title: `Then ${Object.keys(data.outputs ?? {}).length}`,
    };
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === id) {
          nd.data.outputs = {
            ...nd.data.outputs,
            [newId]: value,
          };
        }
        return nd;
      });
    });
  }, []);
  outputHandles.push(
    <div
      key={'create-new-button'}
      className="source-handle"
      title="Add a new output "
    >
      <IconButton style={{ padding: 1 }} onClick={addNewHandle}>
        <AddCircle style={{ width: '20px', height: '20px' }} />
      </IconButton>
    </div>
  );

  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__header">
        <strong>{data.title}</strong>
      </div>

      <div className="node__body">
        <div className="vp-node-handles-container">{inputhandles}</div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(Sequence);
