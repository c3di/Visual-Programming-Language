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
  IsNameDuplicated,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showLabel: boolean;
  handleType: 'source' | 'target';
  handlePosition: Position;
  IsNameDuplicated?: (newName: string, oldName?: string) => boolean;
}): JSX.Element {
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const { setNodes, getNodeById } = useSceneState()?.sceneActions ?? {};

  const onFinishInput = useCallback(
    (element: HTMLElement | EventTarget): void => {
      const inputValue = (element as HTMLInputElement).value;
      if (IsNameDuplicated?.(inputValue, handleData?.title ?? '')) {
        (element as HTMLInputElement).value = handleData.title ?? '';
      } else {
        setNodes?.((nds) => {
          return nds.map((nd) => {
            if (nd.id === nodeId) {
              nd.data.inputs[id].title = inputValue;
            }
            const ref = getNodeById?.(nd.data.nodeRef);
            if (ref?.data.nodeRef === nodeId) {
              nd.data.outputs[id].title = inputValue;
            }
            return nd;
          });
        });
      }
    },
    [handleData.title]
  );

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
        paddingLeft: '10px',
      }}
      title={handleData.tooltip}
    >
      {showLabel && (
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            name
            {widgetFactory.createWidget('anyDataType', {
              value: handleData.title,
              className: `nodrag handle-widget`,
              onBlur: onFinishInput,
              onEnterKeyDown: onFinishInput,
            })}
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '2px',
            }}
          >
            <HandleElement
              id={id}
              handleType={handleType}
              handlePosition={handlePosition}
              handleData={handleData}
            />
            value
            {!handleData.connection &&
              widgetFactory.createWidget(handleData.dataType!, {
                value:
                  handleData.value ??
                  handleData.defaultValue ??
                  (Array.isArray(handleData.dataType)
                    ? DataTypes[handleData.dataType[0]]?.defaultValue
                    : DataTypes[handleData.dataType!]?.defaultValue),
                className: `nodrag handle-widget`,
                onChange: onValueChange,
              })}
          </label>
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
  const IsNameDuplicated = useCallback(
    (newName: string, oldName?: string) => {
      if (newName === oldName) return false;
      const inputsName = data?.inputs
        ? Object.values(data.inputs).map((input) => input.title)
        : [];
      const outputsName = data?.outputs
        ? Object.values(data.outputs).map((output) => output.title)
        : [];
      const allNames = [...inputsName, ...outputsName];
      return allNames.includes(newName);
    },
    [data]
  );
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
          showLabel={data.title === 'return'}
          handleType="target"
          handlePosition={Position.Left}
          IsNameDuplicated={IsNameDuplicated}
        />
      );
    }
  }
  const addNewHandle = useCallback(() => {
    const title = `in_${handleCount.current++}`;
    let handleTitle = `in_${handleCount.current}`;
    while (IsNameDuplicated?.(handleTitle)) {
      handleCount.current++;
      handleTitle = `in_${handleCount.current}`;
    }
    const value = {
      dataType: 'anyDataType',
      title: handleTitle,
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
