import React, { memo } from 'react';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DifferenceIcon from '@mui/icons-material/Difference';

const NodeMenu = memo(function NodeMenu({
  open,
  onClose,
  anchorReference = 'anchorPosition',
  anchorPosition,
  onDelete,
  onCut,
  onCopy,
  onDuplicate,
  onPaste,
  onBreakNodeLinks,
}: {
  open: boolean;
  onClose: () => void;
  anchorReference: 'anchorPosition' | 'anchorEl' | undefined;
  anchorPosition: { top: number; left: number };
  onDelete: () => void;
  onCut: () => void;
  onCopy: () => void;
  onDuplicate: () => void;
  onPaste: () => void;
  onBreakNodeLinks: () => void;
}): JSX.Element {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference={anchorReference}
      anchorPosition={anchorPosition}
    >
      <MenuList>
        <MenuItem onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            DELETE
          </Typography>
        </MenuItem>
        <MenuItem onClick={onCut}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+X
          </Typography>
        </MenuItem>
        <MenuItem onClick={onCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+C
          </Typography>
        </MenuItem>
        <MenuItem onClick={onDuplicate}>
          <ListItemIcon>
            <DifferenceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+D
          </Typography>
        </MenuItem>
        <MenuItem onClick={onPaste}>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+V
          </Typography>
        </MenuItem>
        <MenuItem onClick={onBreakNodeLinks}>Break Node Link(s)</MenuItem>
      </MenuList>
    </Menu>
  );
});

export default NodeMenu;
