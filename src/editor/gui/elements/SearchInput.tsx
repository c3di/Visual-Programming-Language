import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

export default function SearchInput({
  onChange,
  onArrowDownKeyDown,
}: {
  onChange: (value: string) => void;
  onArrowDownKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  return (
    <InputGroup>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="SEARCH"
        height="30px"
        fontSize="var(--vp-searchbar-font-size)"
        fontFamily="var(--vp-searchbar-font-family)"
        borderRadius="var(--vp-searchbar-border-radius)"
        borderColor="var(--vp-searchbar-border-color)"
        _hover={{ borderColor: 'none' }}
        _focus={{
          borderColor: 'rgba(25, 118, 210, 1)',
          boxShadow: 'inset 0 0 0 1.5px rgba(25, 118, 210, 0.2)',
        }}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          icon={value ? <CloseIcon /> : <SearchIcon />}
          onClick={value ? handleClear : undefined}
          aria-label={value ? 'Clear search' : 'Search'}
          h="1.75rem" size="sm"
        />
      </InputRightElement>
    </InputGroup>
  );
}
