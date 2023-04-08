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
import DifferenceIcon from '@mui/icons-material/Difference';

const NodeMenu = memo(function NodeMenu({
  open,
  onClose,
  anchorPosition,
  onDelete,
  onCut,
  onCopy,
  onDuplicate,
  anyConnectableNodeSelected,
  anyConnectionToSelectedNode,
  onBreakNodeLinks,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  onDelete: () => void;
  onCut: () => void;
  onCopy: () => void;
  onDuplicate: () => void;
  anyConnectableNodeSelected: boolean;
  anyConnectionToSelectedNode: boolean;
  onBreakNodeLinks?: () => void;
}): JSX.Element {
  console.log(anyConnectionToSelectedNode);
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
        <MenuItem
          onClick={() => {
            onCut();
            onClose();
          }}
        >
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+X
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onCopy();
            onClose();
          }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+C
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDuplicate();
            onClose();
          }}
        >
          <ListItemIcon>
            <DifferenceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
          <Typography variant="body2" color="text.secondary">
            CTRL+D
          </Typography>
        </MenuItem>
        {anyConnectableNodeSelected && onBreakNodeLinks && (
          <MenuItem
            disabled={!anyConnectionToSelectedNode}
            onClick={() => {
              onBreakNodeLinks();
              onClose();
            }}
          >
            Break Node Link(s)
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
});

export default NodeMenu;
