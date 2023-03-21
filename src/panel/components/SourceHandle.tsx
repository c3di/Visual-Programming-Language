import React, { useEffect, useState } from 'react';
import { type Handle } from '../types';
import './Handle.css';
import {
  Handle as RCHandle,
  Position,
  useReactFlow,
  useStoreApi,
} from 'reactflow';

export default function SourceHandle({
  id,
  nodeId,
  showWidget,
  handleData,
  showTitle,
}: {
  id: string;
  nodeId: string;
  showWidget: boolean;
  handleData: Handle;
  showTitle: boolean;
}): JSX.Element {
  const [widget, setWidget] = useState(<></>);
  useEffect(() => {
    if (showWidget)
      setWidget(
        <input
          defaultValue={handleData.value}
          onChange={(e) => {
            changeValue(e.target.value);
          }}
        />
      );
  }, [showWidget]);
  const [title, setTitle] = useState(<></>);
  useEffect(() => {
    if (showTitle)
      setTitle(
        <label>
          {handleData.title}
          {widget}
        </label>
      );
  }, [showTitle]);

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

  return (
    <div className="source-handle" title={handleData.tooltip}>
      <label>
        {title}
        {widget}
      </label>
      <RCHandle
        id={id}
        type="source"
        position={Position.Right}
        isConnectable={true}
      />
    </div>
  );
}
