import React, { useState } from 'react';
import { IconButton, Input, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

export default function SearchInput({
  onChange,
}: {
  onChange: (value: string) => void;
}): JSX.Element {
  const [hasInput, setHasInput] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Input
      sx={{ padding: '4px 0px 0px 4px!important', fontSize: '16px' }}
      inputRef={inputRef}
      placeholder="Search"
      id="input-with-icon-adornment"
      startAdornment={
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
                  marginRight: '-4px',
                  paddingBottom: '2px',
                }}
              />
            </IconButton>
          ) : (
            <Search
              sx={{ width: '20px', marginRight: '-4px', paddingBottom: '2px' }}
            />
          )}
        </InputAdornment>
      }
      onChange={(e) => {
        setHasInput(e.target.value.length > 0);
        onChange(e.target.value);
      }}
    />
  );
}
