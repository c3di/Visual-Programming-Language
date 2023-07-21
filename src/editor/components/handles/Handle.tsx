import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Handle as RCHandle, type HandleType, type Position } from 'reactflow';
import { useWidgetFactory, useSceneState } from '../../Context';
import { type HandleData, DataTypes } from '../../types';

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
  onValueChange,
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
  onValueChange?: (newVa: any, oldVa?: any) => void;
}): JSX.Element {
  const [label, setLabel] = useState(<></>);
  const widget = useRef<null | JSX.Element>();
  const isSourceHandle = handleType === 'source';
  const { setNodes } = useSceneState()?.sceneActions ?? {};
  const widgetFactory = useWidgetFactory();
  if (!handleData) {
    console.error('handleData is undefined');
  }
  const changeValue = useCallback((newVa: any): void => {
    setNodes?.((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          let oldVa;
          if (isSourceHandle) {
            oldVa = n.data.outputs[id].value ?? n.data.outputs[id].defaultValue;
            n.data.outputs[id].value = newVa;
          } else {
            oldVa = n.data.inputs[id].value ?? n.data.inputs[id].defaultValue;
            n.data.inputs[id].value = newVa;
          }
          onValueChange?.(newVa, oldVa);
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
        (toHideWidgetWhenConnected && !isConnected))
    )
      widget.current = widgetFactory.createWidget(handleData.dataType, {
        value:
          handleData.value ??
          handleData.defaultValue ??
          DataTypes[handleData.dataType]?.defaultValue,
        className: `nodrag handle-widget ${handleData.dataType}`,
        onChange: changeValue,
      });
    let title: null | JSX.Element = null;
    if (showTitle)
      title = <span className="handle-title">{handleData.title} </span>;
    setLabel(
      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {title}
        {(!toHideWidgetWhenConnected || !isConnected) && widget.current}
      </label>
    );
  }, [handleData.connection, handleData.dataType, handleData.title]);

  return (
    <div className={className} title={handleData.tooltip}>
      {label}
      {handleData.connection}
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
