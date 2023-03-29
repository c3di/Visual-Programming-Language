import React from 'react';
import { type WidgetProps } from './WidgetProps';

export function NumberInput(props: WidgetProps): JSX.Element {
  const { value, className, onChange } = props;
  return (
    <input
      className={className}
      type={'number'}
      defaultValue={value}
      onChange={(e) => {
        if (e.target.value === '') {
          onChange(0.0);
        } else {
          // avoid start with 0
          const val = Number(e.target.value);
          onChange(val);
          e.target.value = val.toString();
        }
      }}
      onBlur={(e) => {
        if (e.target.value === '') {
          e.target.value = '0.0';
        }
      }}
    />
  );
}

export function TextInput(props: WidgetProps): JSX.Element {
  const { value, className, onChange } = props;
  return (
    <input
      className={className}
      type={'text'}
      defaultValue={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
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
  const { value: defaultVal, className, onChange } = props;
  return (
    <input
      className={className}
      type={'number'}
      defaultValue={defaultVal}
      onChange={(e) => {
        if (e.target.value === '') onChange(0);
        else {
          // avoid start with 0
          const val = Number(e.target.value);
          onChange(val);
          e.target.value = val.toString();
        }
      }}
      onBlur={(e) => {
        if (e.target.value === '') {
          e.target.value = '0';
        }
      }}
      // avoid float number
      onKeyDown={(e) => {
        if (e.key === '.') {
          e.preventDefault();
        }
      }}
    />
  );
};
