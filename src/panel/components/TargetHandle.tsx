import React, { useEffect, useState } from 'react';
import { type Handle } from '../types';
import './Handle.css';
import {
  Handle as RCHandle,
  Position,
  useReactFlow,
  useStoreApi,
} from 'reactflow';

export default function TargetHandle({
  id,
  nodeId,
  handleData,
  showWidget,
  showTitle,
}: {
  id: string;
  nodeId: string;
  handleData: Handle;
  showWidget: boolean;
  showTitle: boolean;
}): JSX.Element {
  const [widget, setWidget] = useState(<></>);
  const [title, setTitle] = useState(<></>);
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
    if (!showWidget) return;
    if (handleData.connected) {
      changeValue(handleData.defaultValue);
      setWidget(<></>);
      return;
    }
    setWidget(
      <input
        defaultValue={handleData.value}
        onChange={(e) => {
          changeValue(e.target.value);
        }}
      />
    );
  }, [handleData.connected]);

  useEffect(() => {
    if (showTitle)
      setTitle(
        <label>
          {handleData.title}
          {widget}
        </label>
      );
  }, [showTitle]);

  return (
    <div className="target-handle" title={handleData.tooltip}>
      <label>
        {title}
        {widget}
      </label>
      <RCHandle
        id={id}
        type="target"
        position={Position.Left}
        isConnectable={true}
      />
    </div>
  );
}
