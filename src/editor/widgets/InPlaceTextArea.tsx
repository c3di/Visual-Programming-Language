import React, { useEffect, useRef, useState } from 'react';

export default function InPlaceTextArea({
  text,
  placeholder = 'Please double click to edit the comment.',
  onStartEdit = (text: string) => {},
  onStopEdit,
}: {
  text?: string;
  placeholder?: string;
  onStartEdit?: (text: string) => void;
  onStopEdit?: () => void;
}): JSX.Element {
  const [currentText, setCurrentText] = useState(text ?? placeholder);
  const [editable, setEditable] = useState(false);
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editable) {
      inputAreaRef.current?.focus();
      onStartEdit?.(currentText);
    } else {
      inputAreaRef.current?.blur();
      onStopEdit?.();
    }
  }, [editable]);

  return (
    <div
      style={{
        width: '100%',
        fontFamily: 'inherit',
        fontSize: 'inherit',
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
          }}
        >
          {currentText}
        </div>
      )}
      {
        <textarea
          style={{
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            padding: '0px',
            border: '1px solid',
            overflow: 'hidden',
            height: 'auto',
            resize: 'none',
            display: editable ? 'block' : 'none',
          }}
          rows={1}
          ref={inputAreaRef}
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value);
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
