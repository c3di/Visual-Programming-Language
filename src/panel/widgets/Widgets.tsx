import React from 'react';
import { type WidgetProps } from './WidgetProps';

interface InputProps extends WidgetProps {
  type: string;
}

export function Input(props: InputProps): JSX.Element {
  const { type, value, className, onChange } = props;
  return (
    <input
      className={className}
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
  const { value, className, onChange } = props;
  return (
    <input
      className={className}
      type={'checkbox'}
      defaultChecked={value}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
    />
  );
}

export function EnumSelect(props: WidgetProps): JSX.Element {
  const { value, className, onChange, options } = props;
  const defaultValue = value ?? Object.values(options)[0];
  return (
    <select
      className={className}
      defaultValue={defaultValue}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {options &&
        Object.keys(options).map((k) => (
          <option key={k} value={options[k]}>
            {k}
          </option>
        ))}
    </select>
  );
}

export const IntegerInput = (props: WidgetProps): JSX.Element => {
  const { value, className, onChange } = props;
  return (
    <input
      className={className}
      type={'number'}
      defaultValue={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      onKeyDown={(event) => {
        if (/[.]/.test(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
};
