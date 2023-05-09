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
import { Divider } from '@mui/material';

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
      <MenuList
        sx={{ width: '230px', paddingTop: '4px', paddingBottom: '4px' }}
      >
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
          <ListItemText sx={{ paddingRight: 10, fontSize: '15px!important' }}>
            Delete
          </ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px !important' }}
          >
            Del
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{
            paddingRight: '8px',
            paddingLeft: 0,
            paddingBottom: '2px',
            paddingTop: '2px',
          }}
          onClick={() => {
            onCut();
            onClose();
          }}
        >
          <ListItemIcon sx={{ minWidth: '20px !important' }}>
            <ContentCut
              fontSize="small"
              sx={{ width: '16px', padding: '0px 3px 0px 4px', mt: '-2px' }}
            />
          </ListItemIcon>
          <ListItemText sx={{ fontSize: '15px!important' }}>Cut</ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px!important' }}
          >
            Ctrl+X
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{
            paddingRight: '8px',
            paddingLeft: 0,
            paddingBottom: '2px',
            paddingTop: '2px',
          }}
          onClick={() => {
            onCopy();
            onClose();
          }}
        >
          <ListItemIcon sx={{ minWidth: '20px !important' }}>
            <ContentCopy
              fontSize="small"
              sx={{ width: '16px', padding: '0px 3px 0px 4px', mt: '-2px' }}
            />
          </ListItemIcon>
          <ListItemText sx={{ fontSize: '15px!important' }}>Copy</ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px!important' }}
          >
            Ctrl+C
          </Typography>
        </MenuItem>
        <MenuItem
          sx={{
            paddingRight: '8px',
            paddingLeft: 0,
            paddingBottom: '2px',
            paddingTop: '2px',
          }}
          onClick={() => {
            onDuplicate();
            onClose();
          }}
        >
          <ListItemIcon sx={{ minWidth: '20px !important' }}>
            <DifferenceIcon
              fontSize="small"
              sx={{ width: '16px', padding: '0px 3px 0px 4px', mt: '-2px' }}
            />
          </ListItemIcon>
          <ListItemText sx={{ width: '180px', fontSize: '15px!important' }}>
            Duplicate
          </ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '15px!important' }}
          >
            Ctrl+D
          </Typography>
        </MenuItem>

        {anyConnectableNodeSelected && onBreakNodeLinks && (
          <>
            <Divider
              sx={{
                marginTop: '4px !important',
                marginBottom: '4px !important',
              }}
            />
            <MenuItem
              sx={{
                paddingRight: 0,
                paddingLeft: '6px',
                paddingBottom: '2px',
                paddingTop: '2px',
              }}
              disabled={!anyConnectionToSelectedNode}
              onClick={() => {
                onBreakNodeLinks();
                onClose();
              }}
            >
              <Typography
                variant="body2"
                // color="text.secondary"
                sx={{ fontSize: '15px!important' }}
              >
                Break Node Link(s)
              </Typography>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
});

export default NodeMenu;
