import React from 'react';
import { type WidgetProps } from './WidgetProps';

const inputStyles = {
  fontSize: 'var(--vp-widget-font-size1)',
  fontFamily: 'var(--vp-widget-font-family)',
  border: 'var(--vp-widget-border-width) var(--vp-widget-border-color) solid',
  borderRadius: 'var(--vp-widget-border-radius)',
  backgroundColor: 'var(--vp-widget-background-color-white)',
  width: '60px',
};

export function NumberInput(props: WidgetProps): JSX.Element {
  const { value, className, onChange } = props;
  return (
    <input
      className={className}
      type={'number'}
      defaultValue={value}
      style={inputStyles}
      onChange={(e) => {
        if (e.target.value === '') {
          onChange?.(0.0);
        } else {
          // avoid start with 0
          const val = Number(e.target.value);
          onChange?.(val);
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

export function StringInput(props: WidgetProps): JSX.Element {
  const { value, className, onChange, onBlur, onEnterKeyDown } = props;
  return (
    <>
      <span style={{ marginRight: '-4px' }}>&quot;</span>
      <input
        className={className}
        type={'text'}
        defaultValue={value}
        style={inputStyles}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        onBlur={(e) => {
          onBlur?.(e.target);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnterKeyDown?.(e.target);
          }
        }}
      />
      <span style={{ marginLeft: '-4px' }}>&quot;</span>
    </>
  );
}

// todo ListInput, tupleInput

export function TextInput(props: WidgetProps): JSX.Element {
  const { value, className, onChange, onBlur, onEnterKeyDown } = props;
  return (
    <input
      className={className}
      type={'text'}
      defaultValue={value}
      style={inputStyles}
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      onBlur={(e) => {
        onBlur?.(e.target);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onEnterKeyDown?.(e.target);
        }
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
      style={inputStyles}
      onChange={(e) => {
        onChange?.(e.target.checked);
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
      style={inputStyles}
      onChange={(e) => {
        onChange?.(e.target.value);
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
      style={inputStyles}
      onChange={(e) => {
        if (e.target.value === '') onChange?.(0);
        else {
          // avoid start with 0
          const val = Number(e.target.value);
          onChange?.(val);
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
