import React, { useEffect, useState } from 'react';
import { type HandleData } from '../types';
import './Handle.css';
import {
  Handle as RCHandle,
  type HandleType,
  type Position,
  useReactFlow,
  useStoreApi,
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
  // todo: this is a hack to get the node internals, extract this into a hook
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const changeValue = (newVa: string): void => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            handleData: {
              ...node.data.handleData,
              value: newVa,
            },
          };
        }
        return node;
      })
    );
  };
  useEffect(() => {
    if (handleData.connected) {
      changeValue(handleData.defaultValue);
    }

    setLabel(
      <label>
        {showTitle ? (
          <span className="handle-title">{handleData.title}</span>
        ) : null}
        {showWidget &&
        (!toHideWidgetWhenConnected ||
          (toHideWidgetWhenConnected && !handleData.connected)) ? (
          <input
            className="nodrag handle-widget"
            defaultValue={handleData.value}
            onChange={(e) => {
              changeValue(e.target.value);
            }}
          />
        ) : null}
      </label>
    );
  }, [handleData.connected]);

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
