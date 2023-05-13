import React, { useState } from 'react';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

export default function SearchInput({
  onChange,
}: {
  onChange: (value: string) => void;
}): JSX.Element {
  const [hasInput, setHasInput] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div style={{ marginLeft: '4px', marginRight: '4px', marginBottom: '4px' }}>
      <OutlinedInput
        sx={{
          width: '100%',
          height: '30px',
          fontSize: '16px',
          borderRadius: '0',
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'none',
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              border: '1px solid rgba(25, 118, 210, 1)',
              boxShadow: 'inset 0 0 0 1.5px rgba(25, 118, 210, 0.2)',
            },
        }}
        inputRef={inputRef}
        placeholder="SEARCH"
        id="input-with-icon-adornment"
        endAdornment={
          <InputAdornment position="start">
            {hasInput ? (
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = '';
                  setHasInput(false);
                  onChange('');
                }}
              >
                <Clear
                  sx={{
                    width: '20px',
                    marginRight: '-6px',
                  }}
                />
              </IconButton>
            ) : (
              <Search
                sx={{
                  width: '20px',
                  marginRight: '-6px',
                }}
              />
            )}
          </InputAdornment>
        }
        onChange={(e) => {
          setHasInput(e.target.value.length > 0);
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
