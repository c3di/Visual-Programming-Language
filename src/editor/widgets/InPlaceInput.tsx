import React, { useEffect, useRef, useState } from 'react';
import './InPlaceInput.css';

export default function InPlaceInput({
  text,
  onStartEdit,
  onStopEdit,
  onEditChange,
}: {
  text?: string;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  onEditChange?: (text: string) => void;
}): JSX.Element {
  const [currentText, setCurrentText] = useState(text ?? '');
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus({ preventScroll: true });
      onStartEdit?.();
    } else {
      inputRef.current?.blur();
      onStopEdit?.();
    }
  }, [editable]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
        border: '0px',
      }}
      onDoubleClick={(e) => {
        setEditable(true);
      }}
    >
      {!editable && (
        <input
          type="text"
          style={{
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            padding: '0px',
            border: '0px',
            overflow: 'hidden',
            height: '100%',
            resize: 'none',
            wordWrap: 'break-word',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
            backgroundColor: 'transparent',
            opacity: currentText.length ? 1 : 0.5,
          }}
          readOnly={true}
          value={currentText.length ? currentText : 'Double click to edit'}
        ></input>
      )}
      {
        <input
          type="text"
          style={{
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            padding: '0px',
            border: '0px',
            overflow: 'hidden',
            height: '100%',
            resize: 'none',
            wordWrap: 'break-word',
            display: editable ? 'block' : 'none',
          }}
          ref={inputRef}
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value);
            onEditChange?.(e.target.value);
          }}
          onFocus={(e) => {
            document.execCommand('selectAll', false, undefined);
          }}
          onBlur={(e) => {
            setEditable(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setEditable(false);
            }
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></input>
      }
    </div>
  );
}
