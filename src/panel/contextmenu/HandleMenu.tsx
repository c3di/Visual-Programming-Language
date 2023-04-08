import React, { memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

const HandleMenu = memo(function HandleMenu({
  open,
  onClose,
  anchorPosition,
  connection,
  onBreakLinks,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  connection: number | undefined;
  onBreakLinks: () => void;
}): JSX.Element {
  return (
    <Menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuList>
        <MenuItem
          disabled={connection === 0 || connection === undefined}
          onClick={() => {
            onBreakLinks();
            onClose();
          }}
        >
          Break Link(s)
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

export default HandleMenu;
