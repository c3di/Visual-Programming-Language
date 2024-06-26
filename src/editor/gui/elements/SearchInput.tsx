import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

export default function SearchInput({
  onChange,
  onArrowDownKeyDown,
}: {
  onChange: (value: string) => void;
  onArrowDownKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [hasInput, setHasInput] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onArrowDownKeyDown?.(event);
      }
    },
    []
  );
  return (
    <OutlinedInput
      sx={{
        width: '100%',
        height: '30px',
        padding: '0px',
        marginBottom: '3px',
        fontSize: 'var(--vp-searchbar-font-size)',
        fontFamily: 'var(--vp-searchbar-font-family)',
        borderRadius: 'var(--vp-searchbar-border-radius)',
        border:
          'var(--vp-searchbar-border-width) solid var(--vp-searchbar-border-color)',
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'none',
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            border: '1px solid rgba(25, 118, 210, 1)',
            boxShadow: 'inset 0 0 0 1.5px rgba(25, 118, 210, 0.2)',
          },
        '& .MuiOutlinedInput-input': {
          padding: '0px 0px 0px 6px',
        },
      }}
      inputRef={inputRef}
      placeholder="SEARCH"
      id="input-with-icon-adornment"
      endAdornment={
        <InputAdornment position="start">
          {hasInput ? (
            <IconButton
              sx={{
                padding: 0,
              }}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = '';
                setHasInput(false);
                onChange('');
              }}
            >
              <Clear
                sx={{
                  width: 'var(--vp-searchbar-icon-size)',
                  height: 'var(--vp-searchbar-icon-size)',
                  marginRight: '-6px',
                  color: 'var(--vp-searchbar-icon-color)',
                }}
              />
            </IconButton>
          ) : (
            <Search
              sx={{
                width: 'var(--vp-searchbar-icon-size)',
                height: 'var(--vp-searchbar-icon-size)',
                marginRight: '-6px',
                color: 'var(--vp-searchbar-icon-color)',
              }}
            />
          )}
        </InputAdornment>
      }
      onChange={(e) => {
        setHasInput(e.target.value.length > 0);
        onChange(e.target.value);
      }}
      onKeyDown={handleKeyDown}
    />
  );
}
