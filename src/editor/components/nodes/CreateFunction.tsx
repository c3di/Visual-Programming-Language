import React, { memo, useCallback, useRef, useState } from 'react';
import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { SourceHandle, TargetHandle, HandleElement } from '../handles';
import { type HandleData, type ConnectableData } from '../../types';
import { InplaceInput } from '../../widgets';
import { useSceneState, useWidgetFactory } from '../../Context';
import { Position } from 'reactflow';

export function ParameterHandle({
  id,
  nodeId,
  handleData,
  handlePosition,
  handleType,
  IsNameDuplicated,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showWidget: boolean;
  showTitle: boolean;
  handleType: 'source' | 'target';
  handlePosition: Position;
  IsNameDuplicated?: (newName: string, oldName?: string) => boolean;
}): JSX.Element {
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const { setNodes } = useSceneState()?.sceneActions ?? {};

  const onFinishInput = useCallback(
    (element: HTMLElement | EventTarget): void => {
      const inputValue = (element as HTMLInputElement).value;
      if (IsNameDuplicated?.(inputValue, handleData?.title ?? '')) {
        (element as HTMLInputElement).value = handleData.title ?? '';
      } else {
        setNodes?.((nds) => {
          return nds.map((nd) => {
            if (nd.id === nodeId) {
              nd.data.outputs[id].title = inputValue;
            }
            if (nd.data.nodeRef === nodeId) {
              nd.data.inputs[id].title = inputValue;
            }
            return nd;
          });
        });
      }
    },
    [handleData.title]
  );

  return (
    <div
      className={'parameter-handle'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        paddingRight: '10px',
      }}
      title={handleData.tooltip}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        name
        {widgetFactory.createWidget('anyDataType', {
          value: handleData.title,
          className: `nodrag handle-widget`,
          onBlur: onFinishInput,
          onEnterKeyDown: onFinishInput,
        })}
      </label>

      <HandleElement
        id={id}
        handleType={handleType}
        handlePosition={handlePosition}
        handleData={handleData}
      />
    </div>
  );
}

function CreateFunction({
  id,
  data,
}: {
  id: string;
  data: ConnectableData;
}): JSX.Element {
  const handleCount = useRef<number>(0);
  const inputhandles = [];
  for (const inputId in data.inputs) {
    const handle = data.inputs[inputId];
    inputhandles.push(
      <TargetHandle
        key={inputId}
        id={inputId}
        nodeId={id}
        showWidget={!!handle.showWidget || handle.showWidget === undefined}
        showTitle={!!handle.showTitle || handle.showTitle === undefined}
        handleData={handle}
      />
    );
  }

  const addNewHandle = useCallback(() => {
    const title = `out_${handleCount.current++}`;
    let handleTitle = `out_${handleCount.current}`;
    while (IsNameDuplicated?.(handleTitle)) {
      handleCount.current++;
      handleTitle = `out_${handleCount.current}`;
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
          nd.data.outputs = {
            ...nd.data.outputs,
            [title]: value,
          };
        }
        if (nd.data.nodeRef === id) {
          nd = {
            ...nd,
            data: {
              ...nd.data,
              inputs: {
                ...nd.data.inputs,
                [title]: value,
              },
            },
          };
        }
        return nd;
      });
    });
  }, []);

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

  const outputHandles = [];
  for (const outputId in data.outputs) {
    const handle = data.outputs[outputId];
    if (handle.title === 'execOut')
      outputHandles.push(
        <SourceHandle
          key={outputId}
          id={outputId}
          nodeId={id}
          handleData={{ ...handle, tooltip: 'exec out' }}
          showWidget={!!handle.showWidget}
          showTitle={false}
        />
      );
    else
      outputHandles.push(
        <ParameterHandle
          key={outputId}
          id={outputId}
          nodeId={id}
          handleData={{
            ...handle,
            tooltip: `${String(handle.title)}\n${handle.dataType ?? ''}`,
          }}
          showWidget={true}
          showTitle={!!handle.showTitle || handle.showTitle === undefined}
          handleType="source"
          handlePosition={Position.Right}
          IsNameDuplicated={IsNameDuplicated}
        />
      );
  }
  outputHandles.push(
    <div
      key={'create-new-button'}
      className="source-handle"
      title="add a new parameter"
    >
      <IconButton style={{ padding: 1 }} onClick={addNewHandle}>
        <AddCircle style={{ width: '20px', height: '20px' }} />
      </IconButton>
    </div>
  );

  const { setNodes, setExtraCommands } = useSceneState()?.sceneActions ?? {};
  const setEnableDrag = useCallback((enable: boolean) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === id) {
          nd.draggable = enable;
        }
        return nd;
      });
    });
  }, []);
  const [title, setTitle] = useState<string>(data.title);
  const onStartEdit = useCallback(() => {
    setEnableDrag(false);
  }, []);
  const onStopEdit = useCallback(() => {
    setEnableDrag(true);
  }, []);
  const onEditChange = useCallback((text: string) => {
    setTitle(text);
    updateName(text, data.title);
    data.title = text;
  }, []);

  const updateName = useCallback((newVa: string, oldVa: string) => {
    setExtraCommands?.((cmds) =>
      cmds.map((cmd) => {
        if (cmd.name === oldVa) {
          cmd.name = newVa;
        }
        return cmd;
      })
    );

    setNodes?.((nds) =>
      nds.map((n) => {
        if (n.data.nodeRef === id || n.id === id) {
          n.data = { ...n.data, title: newVa };
        }
        return n;
      })
    );
  }, []);

  return (
    <div
      title={`add a new function named ${title}`}
      className="vp-node-container"
    >
      <div className="node__header">
        <InplaceInput
          text={title}
          defaultEditable={false}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onEditChange={onEditChange}
        />
      </div>
      <div className="node__body">
        <div className="vp-node-handles-container">{inputhandles}</div>
        <div className="vp-node-handles-container">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(CreateFunction);
