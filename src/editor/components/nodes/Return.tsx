import React, { memo, useCallback, useRef } from 'react';
import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { SourceHandle, TargetHandle, HandleElement } from '../handles';
import { type HandleData, type ConnectableData, DataTypes } from '../../types';
import { useSceneState, useWidgetFactory } from '../../Context';
import { Position } from 'reactflow';

export function ParameterHandle({
  id,
  nodeId,
  handleData,
  showLabel,
  handlePosition,
  handleType,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showLabel: boolean;
  handleType: 'source' | 'target';
  handlePosition: Position;
}): JSX.Element {
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const { setNodes, deleteAllEdgesOfHandle, getNodeById } =
    useSceneState()?.sceneActions ?? {};
  const onDatatypeChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.inputs[id].dataType = value;
          nd.data.inputs[id].defaultValue = DataTypes[value].defaultValue;
          nd.data.inputs[id].value = DataTypes[value].defaultValue;
        }
        const ref = getNodeById?.(nd.data.nodeRef);
        if (ref?.data.nodeRef === nodeId) {
          nd.data.outputs[id].dataType = value;
          deleteAllEdgesOfHandle?.(nd.id, id);
        }
        return nd;
      });
    });
    deleteAllEdgesOfHandle?.(nodeId, id);
  }, []);
  const onParaNameChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.inputs[id].title = value;
        }
        const ref = getNodeById?.(nd.data.nodeRef);
        if (ref?.data.nodeRef === nodeId) {
          nd.data.outputs[id].title = value;
        }
        return nd;
      });
    });
  }, []);
  const onValueChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.inputs[id].value = value;
        }

        return nd;
      });
    });
  }, []);
  return (
    <div
      className={'parameter-handle'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        paddingLeft: '10px',
      }}
      title={handleData.tooltip}
    >
      <HandleElement
        id={id}
        handleType={handleType}
        handlePosition={handlePosition}
        handleData={handleData}
      />
      {showLabel && (
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
              onChange: onParaNameChange,
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
                onChange: onValueChange,
              })}
            </label>
          )}
        </div>
      )}
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
  const getNodeById = useSceneState()?.sceneActions.getNodeById;
  const addNewHandle = useCallback(() => {
    const title = `new_in_${handleCount.current++}`;
    const value = {
      dataType: 'boolean',
      title: `new_in_${handleCount.current}`,
      showWidget: false,
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
  const inputhandles = [];
  for (const inputId in data.inputs) {
    const handle = data.inputs[inputId];
    if (handle.title === 'execIn')
      inputhandles.push(
        <TargetHandle
          key={inputId}
          id={inputId}
          nodeId={id}
          showWidget={!!handle.showWidget || handle.showWidget === undefined}
          showTitle={false}
          handleData={{ ...handle, tooltip: 'exec in' }}
        />
      );
    else {
      inputhandles.push(
        <ParameterHandle
          key={inputId}
          id={inputId}
          nodeId={id}
          handleData={{
            ...handle,
            tooltip: `the return value of ${String(handle.title)}`,
          }}
          showLabel={data.title === 'Return'}
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
        handleData={handle}
        showWidget={!!handle.showWidget}
        showTitle={false}
      />
    );
  }
  inputhandles.push(
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

  const { setNodes } = useSceneState()?.sceneActions ?? {};

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

export default memo(Return);
