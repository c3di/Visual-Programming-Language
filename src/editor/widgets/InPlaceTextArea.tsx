import React, { useCallback, useEffect, useRef, useState } from 'react';
import './InPlaceTextArea.css';

export default function InPlaceTextArea({
  text,
  initialRow = 1,
  defaultEditable,
  onStartEdit,
  onStopEdit,
  onEditChange,
}: {
  text?: string;
  initialRow?: number;
  defaultEditable?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
  onEditChange?: (text: string) => void;
}): JSX.Element {
  const [currentText, setCurrentText] = useState(text ?? 'comment');
  const [editable, setEditable] = useState<boolean>(false);
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editable) {
      inputAreaRef.current?.focus();
      onStartEdit?.();
    } else {
      inputAreaRef.current?.blur();
      onStopEdit?.();
    }
    updateTextAreaSize(inputAreaRef.current);
  }, [editable]);

  useEffect(() => {
    if (editable !== defaultEditable) setEditable(!!defaultEditable);
  }, []);

  const updateTextAreaSize = useCallback(
    (target: HTMLTextAreaElement | null) => {
      if (!target) return;
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    },
    []
  );

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
            opacity: currentText.length ? 1 : 0.5,
          }}
        >
          {currentText?.length ? currentText : 'Double click to edit'}
        </div>
      )}
      {
        <textarea
          style={{
            fontFamily: 'inherit',
            fontSize: 'inherit',
            overflow: 'hidden',
            wordWrap: 'break-word',
            display: editable ? 'block' : 'none',
          }}
          className="text-area"
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
            updateTextAreaSize(e.target as HTMLTextAreaElement);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></textarea>
      }
    </div>
  );
}
