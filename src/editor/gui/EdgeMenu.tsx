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
      transitionDuration={0}
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
          sx={{
            paddingRight: '8px',
            paddingLeft: 0,
            paddingBottom: '2px',
            paddingTop: '2px',
          }}
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <ListItemIcon sx={{ minWidth: '20px !important' }}>
            <DeleteIcon
              fontSize="small"
              sx={{ width: '16px', padding: '0px 3px 0px 4px', mt: '-2px' }}
            />
          </ListItemIcon>
          <ListItemText sx={{ paddingRight: 10 }}>Delete</ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px' }}
          >
            Del
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

export default EdgeMenu;
