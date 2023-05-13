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
      sx={{
        padding: '4px 10px 0px 4px!important',
        fontSize: '16px',
        border: '1px solid',
        borderBottomWidth: '0px',
        borderColor: '#919191',
        width: '99%',
        marginLeft: '4px',
        marginRight: '2px',
        marginBottom: '8px',
        height: '30px',
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
