import React, { useEffect, useRef, useState } from 'react';

export default function InPlaceTextArea({
  text,
  placeholder = 'Please double click to edit the comment.',
}: {
  text?: string;
  placeholder?: string;
}): JSX.Element {
  const [currentText, setCurrentText] = useState(text ?? placeholder);
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [editable]);

  return (
    <div
      ref={inputRef}
      style={{
        width: '100%',
        wordWrap: 'break-word',
        userSelect: 'none',
      }}
      contentEditable={editable}
      onDoubleClick={(e) => {
        setEditable(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          setEditable(false);
        }
      }}
      onBlur={(e) => {
        setCurrentText(e.target.innerText);
        setEditable(false);
      }}
      onFocus={(e) => {
        document.execCommand('selectAll', false, undefined);
      }}
      onInput={(e) => {
        setCurrentText((e.target as HTMLElement).innerText);
      }}
    >
      {currentText}
    </div>
  );
}
