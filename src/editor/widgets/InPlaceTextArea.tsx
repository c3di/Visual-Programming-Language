import React, { useEffect, useRef, useState } from 'react';
import './InPlaceTextArea.css';

export default function InPlaceTextArea({
  text,
  placeholder = 'Please double click to edit the comment.',
  initialRow = 1,
  onStartEdit,
  onStopEdit,
  onEditChange,
}: {
  text?: string;
  placeholder?: string;
  initialRow?: number;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  onEditChange?: (text: string) => void;
}): JSX.Element {
  const [currentText, setCurrentText] = useState(text ?? placeholder);
  const [editable, setEditable] = useState(false);
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editable) {
      inputAreaRef.current?.focus();
      onStartEdit?.();
    } else {
      inputAreaRef.current?.blur();
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
        border: '0px',
      }}
      onDoubleClick={(e) => {
        setEditable(true);
      }}
    >
      {!editable && (
        <div
          style={{
            width: '100%',
            wordWrap: 'break-word',
            userSelect: 'none',
            padding: '0px',
            border: '0px',
          }}
        >
          {currentText?.length === 0 ? 'Double click to edit' : currentText}
        </div>
      )}
      {
        <textarea
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
          className="text-area"
          placeholder="Double click to edit"
          rows={initialRow}
          ref={inputAreaRef}
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
          onInput={(e) => {
            (e.target as HTMLTextAreaElement).style.height = 'auto';
            (e.target as HTMLTextAreaElement).style.height = `${
              (e.target as HTMLTextAreaElement).scrollHeight
            }px`;
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></textarea>
      }
    </div>
  );
}
