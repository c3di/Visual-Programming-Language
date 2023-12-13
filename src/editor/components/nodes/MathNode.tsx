import React, { memo, useCallback, useRef } from 'react';
import { type ConnectableData } from '../../types';
import { TargetHandle, SourceHandle } from '../handles';
import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useSceneState } from '../../Context';

function MathNode({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const inputHandles = [];
  for (const inputId in data.inputs) {
    inputHandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={true}
        showTitle={!!data.inputs[inputId].showTitle}
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
        handleData={data.outputs[outputId]}
        showWidget={false}
        showTitle={!!data.outputs[outputId].showTitle}
      />
    );
  }
  const handleCount = useRef<number>(0);
  const { setNodes, getNodeById } = useSceneState()?.sceneActions ?? {};
  const addNewHandle = useCallback(() => {
    const title = `in_${handleCount.current++}`;
    const value = {
      title: `${Object.values(data.inputs!)[0].title ?? 'input'}`,
      dataType: data.dataType,
      showTitle: false,
      showWidget: true,
      deletable: true,
    };
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === id) {
          nd.data.inputs = {
            ...nd.data.inputs,
            [title]: value,
          };
        }
        const ref = getNodeById?.(nd.data.nodeRef);
        if (ref?.data.nodeRef === id) {
          nd = {
            ...nd,
            data: {
              ...nd.data,
              outputs: {
                ...nd.data.outputs,
                [title]: value,
              },
            },
          };
        }
        return nd;
      });
    });
  }, []);
  if (data.enableAddNewOne)
    inputHandles.push(
      <div
        className="target-handle"
        title="add a new return value"
        key={'create-new-button'}
      >
        <IconButton style={{ padding: 1 }} onClick={addNewHandle}>
          <AddCircle style={{ width: '20px', height: '20px' }} />
        </IconButton>
      </div>
    );
  return (
    <div title={data.tooltip} className="vp-node-container">
      <div className="node__body">
        <div
          className="vp-node-handles-container"
          style={{ justifyContent: 'center' }}
        >
          {inputHandles}
        </div>
        <div
          className="vp-node-handles-container"
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: '1.5em',
          }}
        >
          <strong>{data.title}</strong>
        </div>
        <div
          className="vp-node-handles-container"
          style={{ justifyContent: 'center' }}
        >
          {outputHandles}
        </div>
      </div>
    </div>
  );
}

export default memo(MathNode);
