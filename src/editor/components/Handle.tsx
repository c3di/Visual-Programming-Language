import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type HandleData, DataTypes } from '../types';
import './Handle.css';
import {
  Handle as RCHandle,
  type HandleType,
  type Position,
  useReactFlow,
} from 'reactflow';
import { useWidgetFactory } from '../Context';

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
  const widget = useRef<null | JSX.Element>();
  const title = useRef<null | JSX.Element>();
  const isSourceHandle = handleType === 'source';
  const { setNodes } = useReactFlow();
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const changeValue = useCallback((newVa: any): void => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          if (isSourceHandle) n.data.outputs[id].value = newVa;
          else n.data.inputs[id].value = newVa;
        }
        return n;
      })
    );
  }, []);

  useEffect(() => {
    const isConnected = Boolean(handleData.connection);
    if (isConnected && showWidget) {
      changeValue(handleData.defaultValue);
    }
    if (
      showWidget &&
      handleData.dataType !== undefined &&
      (!toHideWidgetWhenConnected ||
        (toHideWidgetWhenConnected && !isConnected && !widget.current))
    )
      widget.current = widgetFactory.createWidget(handleData.dataType, {
        value:
          handleData.value ??
          handleData.defaultValue ??
          DataTypes[handleData.dataType]?.defaultValue,
        className: `nodrag handle-widget ${handleData.dataType}`,
        onChange: changeValue,
      });
    if (showTitle && !title.current)
      title.current = <span className="handle-title">{handleData.title}</span>;
    setLabel(
      <label>
        {title.current}
        {(!toHideWidgetWhenConnected || !isConnected) && widget.current}
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
