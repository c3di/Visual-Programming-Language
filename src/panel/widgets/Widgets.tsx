import React from 'react';
import { type WidgetProps } from './WidgetProps';

export function NumberInput(props: WidgetProps): JSX.Element {
  const { value, onChange } = props;
  return (
    <input
      className="nodrag handle-widget"
      defaultValue={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}
