import React, { memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';

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
      transitionDuration={0}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuList className="VP_MenuList">
        <MenuItem
          className="VP_MenuItem"
          disabled={connection === 0 || connection === undefined}
          onClick={() => {
            onBreakLinks();
            onClose();
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px' }}
          >
            Break Node Link(s)
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

export default HandleMenu;
