import React from 'react';
import { type WidgetProps } from './WidgetProps';

interface InputProps extends WidgetProps {
  type: string;
}

export function Input(props: InputProps): JSX.Element {
  const { type, value, onChange } = props;
  return (
    <input
      className="nodrag handle-widget"
      type={type}
      defaultValue={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}
export function NumberInput(props: WidgetProps): JSX.Element {
  return Input({ type: 'number', ...props });
}

export function TextInput(props: WidgetProps): JSX.Element {
  return Input({ type: 'text', ...props });
}

export function BooleanInput(props: WidgetProps): JSX.Element {
  return Input({ type: 'checkbox', ...props });
}
