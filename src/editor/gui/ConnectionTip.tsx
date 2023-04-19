import React, { memo } from 'react';
import { Menu } from '@mui/material';
import { type ConnectionStatus, ConnectionAction } from '../types';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import StyledTreeItem from './StyledTreeItem';

const ConnectionTip = memo(function ConnectionTip({
  open,
  onClose,
  anchorPosition,
  connectionStatus,
}: {
  open: boolean;
  onClose: () => void;
  anchorPosition: { top: number; left: number };
  connectionStatus?: ConnectionStatus;
}): JSX.Element {
  return (
    <Menu
      sx={{ padding: 0, pointerEvents: 'none' }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      open={open && connectionStatus !== undefined}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <StyledTreeItem
        sx={{ pointerEvents: 'none' }}
        nodeId="1"
        labelText={connectionStatus?.message ?? ''}
        labelIcon={
          connectionStatus?.action === ConnectionAction.Reject
            ? ClearIcon
            : CheckIcon
        }
        iconColor={
          connectionStatus?.action === ConnectionAction.Reject
            ? 'error'
            : 'success'
        }
      ></StyledTreeItem>
    </Menu>
  );
});

export default ConnectionTip;
