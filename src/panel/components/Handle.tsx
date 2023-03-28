import React, { useEffect, useState } from 'react';
import { type HandleData } from '../types';
import './Handle.css';
import {
  Handle as RCHandle,
  type HandleType,
  type Position,
  useReactFlow,
} from 'reactflow';

export default function Handle({
  id,
  nodeId,
  handleData,
  showWidget,
  showTitle,
  toHideWidgetWhenConnected,
  className,
  handleType,
  handlePosition,
}: {
  id: string;
  nodeId: string;
  handleData: HandleData;
  showWidget: boolean;
  showTitle: boolean;
  toHideWidgetWhenConnected: boolean;
  className: string;
  handleType: HandleType;
  handlePosition: Position;
}): JSX.Element {
  const [label, setLabel] = useState(<></>);
  const isSourceHandle = handleType === 'source';
  const { setNodes } = useReactFlow();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const changeValue = (newVa: any): void => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          if (isSourceHandle) n.data.outputs[id].value = newVa;
          else n.data.inputs[id].value = newVa;
        }
        return n;
      })
    );
  };

  useEffect(() => {
    const isConnected = handleData.connection > 0;
    if (isConnected && showWidget) {
      changeValue(handleData.defaultValue);
    }

    setLabel(
      <label>
        {showTitle ? (
          <span className="handle-title">{handleData.title}</span>
        ) : null}
        {showWidget &&
        (!toHideWidgetWhenConnected ||
          (toHideWidgetWhenConnected && !isConnected)) ? (
          <input
            className="nodrag handle-widget"
            defaultValue={handleData.defaultValue}
            onChange={(e) => {
              changeValue(e.target.value);
            }}
          />
        ) : null}
      </label>
    );
  }, [handleData.connection]);

  return (
    <div className={className} title={handleData.tooltip}>
      {label}
      <RCHandle
        id={id}
        type={handleType}
        position={handlePosition}
        isConnectable={true}
      />
    </div>
  );
}
