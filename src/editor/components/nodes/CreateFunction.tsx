import React, { memo, useCallback, useRef, useState } from 'react';
import { IconButton } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { SourceHandle, TargetHandle } from '../handles';
import { type HandleData, type ConnectableData, DataTypes } from '../../types';
import { InplaceInput } from '../../widgets';
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
  const onDatatypeChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.outputs[id].dataType = value;
        }
        if (nd.data.nodeRef === nodeId) {
          nd.data.inputs[id].dataType = value;
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
          nd.data.outputs[id].title = value;
        }
        if (nd.data.nodeRef === nodeId) {
          nd.data.inputs[id].title = value;
        }
        return nd;
      });
    });
  }, []);
  const onValueChange = useCallback((value: string) => {
    setNodes?.((nds) => {
      return nds.map((nd) => {
        if (nd.id === nodeId) {
          nd.data.outputs[id].value = value;
        }
        if (nd.data.nodeRef === nodeId) {
          nd.data.inputs[id].value = value;
        }
        return nd;
      });
    });
  }, []);
  return (
    <div
      className={'parameter-handle'}
      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
      title={handleData.tooltip}
    >
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
      </div>
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
    const title = `new-out-${handleCount.current++}`;
    const value = {
      dataType: 'boolean',
      title: `new-out-${handleCount.current}`,
      showWidget: false,
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
            tooltip: `parameter ${String(handle.title)}`,
          }}
          showWidget={true}
          showTitle={!!handle.showTitle || handle.showTitle === undefined}
          handleType="source"
          handlePosition={Position.Right}
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
      className="vp-node-containter"
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
        <div className="vp-node-handles-containter">{inputhandles}</div>
        <div className="vp-node-handles-containter">{outputHandles}</div>
      </div>
    </div>
  );
}

export default memo(CreateFunction);
