import React, { memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

const EdgeMenu = memo(function EdgeMenu({
  open,
  onClose,
  anchorPosition,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  onDelete: () => void;
}): JSX.Element {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            DELETE
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

export default EdgeMenu;
