import React, { memo, useCallback, useRef } from 'react';
import { IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { SourceHandle, TargetHandle } from '../handles';
import { type HandleData, type ConnectableData, DataTypes } from '../../types';
import { useSceneState, useWidgetFactory } from '../../Context';
import { Handle as RCHandle, Position } from 'reactflow';

export function ParameterHandle({
  id,
  nodeId,
  handleData,
  handlePosition,
  handleType,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showWidget: boolean;
  showTitle: boolean;
  handleType: 'source' | 'target';
  handlePosition: Position;
}): JSX.Element {
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const { setNodes, deleteAllEdgesOfHandle } =
    useSceneState()?.sceneActions ?? {};
  const removeHandle = useCallback(() => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          const { [id]: _, ...remeined } = nd.data.inputs;
          nd.data.inputs = remeined;
        }
        return nd;
      });
    });
  }, []);
  const onDatatypeChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.inputs[id].dataType = value;
        }
        return nd;
      });
    });
    deleteAllEdgesOfHandle?.(nodeId, id);
  }, []);
  return (
    <div
      className={'parameter-handle'}
      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
    >
      <RCHandle
        className={`vp-rc-handle-${handleData.dataType ?? 'default'}`}
        id={id}
        type={handleType}
        position={handlePosition}
        isConnectable={true}
        style={{
          top: 0,
          left: 0,
          transform:
            handleType === 'target'
              ? 'translate(-50%, 0)'
              : 'translate(50%, 0)',
          position: 'relative',
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gridGap: '3px',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          name
          {widgetFactory.createWidget('string', {
            value: handleData.title,
            className: `nodrag handle-widget`,
            // onChange: changeValue,
          })}
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          dataType
          {widgetFactory.createSelectorWidget({
            value: handleData.dataType,
            className: `nodrag handle-widget`,
            onChange: onDatatypeChange,
          })}
        </label>
        {!handleData.connection && (
          <label
            style={{
              gridColumn: 'span 2',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            defaultValue
            {widgetFactory.createWidget(handleData.dataType!, {
              value:
                handleData.value ??
                handleData.defaultValue ??
                DataTypes[handleData.dataType!]?.defaultValue,
              className: `nodrag handle-widget`,
              // onChange: changeValue,
            })}
          </label>
        )}
      </div>
      <IconButton
        style={{ padding: 1 }}
        title="remove this"
        onClick={removeHandle}
      >
        <RemoveCircle style={{ width: '20px', height: '20px' }} />
      </IconButton>
    </div>
  );
}

function Return({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const handleCount = useRef<number>(0);
  const addNewHandle = useCallback(() => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === id) {
          nd.data.inputs = {
            ...nd.data.inputs,
            [`output-${handleCount.current}`]: {
              dataType: 'boolean',
              title: `output-${handleCount.current++}`,
            },
          };
        }
        return nd;
      });
    });
  }, []);
  const inputhandles = [];
  for (const inputId in data.inputs) {
    const handle = data.inputs[inputId];
    if (data.inputs[inputId].title === 'execIn')
      inputhandles.push(
        <TargetHandle
          key={inputId}
          id={inputId}
          nodeId={id}
          showWidget={!!handle.showWidget || handle.showWidget === undefined}
          showTitle={false}
          handleData={handle}
        />
      );
    else {
      inputhandles.push(
        <ParameterHandle
          key={inputId}
          id={inputId}
          nodeId={id}
          handleData={data.inputs[inputId]}
          showWidget={true}
          showTitle={true}
          handleType="target"
          handlePosition={Position.Left}
        />
      );
    }
  }
  const outputHandles = [];
  for (const outputId in data.outputs) {
    const handle = data.outputs[outputId];
    outputHandles.push(
      <SourceHandle
        key={outputId}
        id={outputId}
        nodeId={id}
        handleData={data.outputs[outputId]}
        showWidget={!!handle.showWidget}
        showTitle={false}
      />
    );
  }
  inputhandles.push(
    <div className="target-handle" title="create a new">
      <IconButton style={{ padding: 1 }} onClick={addNewHandle}>
        <AddCircle style={{ width: '20px', height: '20px' }} />
      </IconButton>
    </div>
  );

  const { setNodes } = useSceneState()?.sceneActions ?? {};

  return (
    <div title={data.tooltip} className="vp-node-containter">
      <div className="node__header">
        <strong>Return</strong>
      </div>
      <div className="node__body">
        <div className="vp-node-handles-containter">{inputhandles}</div>
        <div className="vp-node-handles-containter">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(Return);
